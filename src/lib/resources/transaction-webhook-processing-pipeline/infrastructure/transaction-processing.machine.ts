import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {
  Chain,
  IChainable,
  Parallel,
  Map as MapState,
  Wait,
  WaitTime,
  StateMachine,
  Succeed,
  Fail,
} from 'aws-cdk-lib/aws-stepfunctions';
import { TransactionsRawStorageFunction } from './transactions-raw-storage.function';
import { Duration, Stack } from 'aws-cdk-lib';
import { TransactionValidatorFunction } from './transaction-validator.function';
import { TransactionsRemodellerFunction } from './transactions-remodeller.function';

export class TransactionProcessingMachineBuilder {
  private stateMachineDefinition: Chain;
  private stack: Stack;

  private readonly REMODELLER_MAX_CONCURRENT_EXECUTIONS = 10;

  public build(stack: Stack): StateMachine {
    this.stack = stack;
    this.createValidatorStep().createParallelStorageStep().createSucceedStep();

    return new StateMachine(this.stack, 'Transaction processing machine', {
      definition: this.stateMachineDefinition,
      timeout: Duration.minutes(5),
      stateMachineName: 'Transaction processing machine',
      comment: 'This state machine processes transactions from the webhook.',
    });
  }

  private chainStep(step: IChainable): void {
    if (!this.stateMachineDefinition) {
      this.stateMachineDefinition = step as Chain;
    } else {
      this.stateMachineDefinition = this.stateMachineDefinition.next(step);
    }
  }

  protected createValidatorStep(): TransactionProcessingMachineBuilder {
    const validatorLambda = TransactionValidatorFunction.create(this.stack);
    const lambdaJob = new LambdaInvoke(this.stack, 'Validate transactions', {
      lambdaFunction: validatorLambda,
      outputPath: '$.Payload',
    });

    lambdaJob.addCatch(this.createFailureStep());
    this.chainStep(lambdaJob);

    return this;
  }

  protected createRawStorageStep(): LambdaInvoke {
    const rawStorageLambda = TransactionsRawStorageFunction.create(this.stack);
    return new LambdaInvoke(this.stack, 'Store raw transactions', {
      lambdaFunction: rawStorageLambda,
      outputPath: '$.Payload',
    });
  }

  protected createParallelStorageStep(): TransactionProcessingMachineBuilder {
    const parallel = new Parallel(this.stack, 'Parallel storage');

    const rawStorageLambda = this.createRawStorageStep();
    const remodellerJob = this.createRemodellingStep();

    parallel.branch(rawStorageLambda);
    parallel.branch(remodellerJob);

    parallel.addCatch(this.createFailureStep());

    this.chainStep(parallel);

    return this;
  }

  protected createRemodellingStep(): MapState {
    const remodellerLambda = TransactionsRemodellerFunction.create(this.stack);
    const lambdaJob = new LambdaInvoke(this.stack, 'Remodel transactions', {
      lambdaFunction: remodellerLambda,
      outputPath: '$.Payload',
    });

    const mapState = new MapState(this.stack, 'Remodelling mapper', {
      maxConcurrency: this.REMODELLER_MAX_CONCURRENT_EXECUTIONS,
      itemsPath: '$.Payload',
      resultPath: '$.Payload',
      parameters: {},
    });

    mapState.iterator(lambdaJob);

    return mapState;
  }

  protected createSucceedStep(): TransactionProcessingMachineBuilder {
    const succeed = new Succeed(this.stack, 'Succeed');

    this.chainStep(succeed);

    return this;
  }

  protected createFailureStep(): Fail {
    return new Fail(this.stack, 'Failure');
  }
}
