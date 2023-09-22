import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {
  Chain,
  Fail,
  IChainable,
  LogLevel,
  Parallel,
  StateMachine,
  StateMachineType,
  Succeed,
} from 'aws-cdk-lib/aws-stepfunctions';
import {
  TransactionsRawStorageFunction,
  TransactionsRemodellerFunction,
  TransactionValidatorFunction,
} from './index';
import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';

export class TransactionProcessingMachineBuilder {
  private stateMachineDefinition: Chain;
  private stack: Stack;

  public build(stack: Stack): StateMachine {
    this.stack = stack;
    const failure = this.createFailureStep();

    const stateMachineLogGroup = new LogGroup(
      this.stack,
      'TransactionProcessingMachineLogGroup',
      {
        logGroupName: '/aws/states/transaction-processing-machine',
        retention: RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );
    this.createValidatorStep({
      failure,
    })
      .createParallelStorageStep({
        failure,
      })
      .createSucceedStep();

    const stateMachine = new StateMachine(
      this.stack,
      'TransactionProcessingMachine',
      {
        definition: this.stateMachineDefinition,
        timeout: Duration.minutes(5),
        stateMachineName: 'transaction-processing-machine',
        stateMachineType: StateMachineType.EXPRESS,
        comment: 'This state machine processes transactions from the webhook.',
        logs: {
          destination: stateMachineLogGroup,
          level: LogLevel.ALL,
        },
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

  protected createValidatorStep(params: {
    failure?: Fail;
  }): TransactionProcessingMachineBuilder {
    const validatorLambda = new TransactionValidatorFunction().create(
      this.stack
    );
    const lambdaJob = new LambdaInvoke(this.stack, 'Validate transactions', {
      lambdaFunction: validatorLambda,
    });

    const failure = params.failure || this.createFailureStep();
    lambdaJob.addCatch(failure);
    this.chainStep(lambdaJob);

    return this;
  }

  protected createRawStorageStep(): LambdaInvoke {
    const rawStorageLambda = new TransactionsRawStorageFunction().create(
      this.stack
    );
    return new LambdaInvoke(this.stack, 'Store raw transactions', {
      lambdaFunction: rawStorageLambda,
      inputPath: '$.Payload',
    });
  }

  protected createParallelStorageStep(params: {
    failure?: Fail;
  }): TransactionProcessingMachineBuilder {
    const parallel = new Parallel(this.stack, 'Parallel storage');

    const rawStorageLambda = this.createRawStorageStep();
    const remodellerJob = this.createRemodellingStep();

    parallel.branch(rawStorageLambda);
    parallel.branch(remodellerJob);

    const failure = params.failure || this.createFailureStep();
    parallel.addCatch(failure);

    this.chainStep(parallel);

    return this;
  }

  protected createRemodellingStep(): LambdaInvoke {
    const remodellerLambda = new TransactionsRemodellerFunction().create(
      this.stack
    );
    return new LambdaInvoke(this.stack, 'Remodel transactions', {
      lambdaFunction: remodellerLambda,
      inputPath: '$.Payload',
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
