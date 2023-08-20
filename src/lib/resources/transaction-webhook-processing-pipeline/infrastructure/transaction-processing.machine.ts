import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {
  Chain,
  Fail,
  IChainable,
  Map as MapState,
  Parallel,
  StateMachine,
  Succeed,
} from 'aws-cdk-lib/aws-stepfunctions';
import {
  TransactionsRawStorageFunction,
  TransactionValidatorFunction,
  TransactionsRemodellerFunction,
} from './functions';
import { Duration, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { TransactionApiProps } from './index';

export class TransactionProcessingMachineBuilder {
  private stateMachineDefinition: Chain;
  private stack: Stack;


  public build(stack: Stack, params: TransactionApiProps): StateMachine {
    this.stack = stack;
    this.createValidatorStep().createParallelStorageStep().createSucceedStep();

    const stateMachine = new StateMachine(
      this.stack,
      'Transaction processing machine',
      {
        definition: this.stateMachineDefinition,
        timeout: Duration.minutes(5),
        stateMachineName: 'Transaction processing machine',
        comment: 'This state machine processes transactions from the webhook.',
      }
    );

    stateMachine.grantStartExecution(this.createExecutionRole());

    return stateMachine;
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
    });

    lambdaJob.addCatch(this.createFailureStep());
    this.chainStep(lambdaJob);

    return this;
  }

  protected createRawStorageStep(): LambdaInvoke {
    const rawStorageLambda = TransactionsRawStorageFunction.create(this.stack);
    return new LambdaInvoke(this.stack, 'Store raw transactions', {
      lambdaFunction: rawStorageLambda,
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

  protected createRemodellingStep(): LambdaInvoke {
    const remodellerLambda = TransactionsRemodellerFunction.create(this.stack);
    return new LambdaInvoke(this.stack, 'Remodel transactions', {
      lambdaFunction: remodellerLambda,
    });
  }

  protected createSucceedStep(): TransactionProcessingMachineBuilder {
    const succeed = new Succeed(this.stack, 'Succeed');

    this.chainStep(succeed);

    return this;
  }

  protected createFailureStep(): Fail {
    return new Fail(this.stack, 'Failure');
  }

  protected createExecutionRole(): Role {
    return new Role(
      this.stack,
      'Transaction processing machine execution role',
      {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      }
    );
  }
}
