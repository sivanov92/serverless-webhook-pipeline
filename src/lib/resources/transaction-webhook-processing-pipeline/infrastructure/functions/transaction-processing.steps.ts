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

  /**
   * Factory method to create a new instance of the state machine.
   *
   * @param stack
   */
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

  /**
   * Chains a step to the state machine definition.
   *
   * @param step
   * @private
   */
  private chainStep(step: IChainable): void {
    if (!this.stateMachineDefinition) {
      this.stateMachineDefinition = step as Chain;
    } else {
      this.stateMachineDefinition = this.stateMachineDefinition.next(step);
    }
  }

  /**
   * Creates a step that validates the transactions.
   *
   * @param params
   * @protected
   */
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

  /**
   * Creates a step that stores the transactions in S3.
   *
   * @protected
   */
  protected createRawStorageStep(): LambdaInvoke {
    const rawStorageLambda = new TransactionsRawStorageFunction().create(
      this.stack
    );
    return new LambdaInvoke(this.stack, 'Store raw transactions', {
      lambdaFunction: rawStorageLambda,
      inputPath: '$.Payload',
    });
  }

  /**
   * Creates a step that stores the transactions in parallel.
   * @param params
   *
   * @protected
   */
  protected createParallelStorageStep(params: {
    failure?: Fail;
  }): TransactionProcessingMachineBuilder {
    const parallel = new Parallel(this.stack, 'Parallel storage');

    parallel.branch(this.createRawStorageStep());
    parallel.branch(this.createRemodellingStep());

    const failure = params.failure || this.createFailureStep();
    parallel.addCatch(failure);

    this.chainStep(parallel);

    return this;
  }

  /**
   * Creates a step that remodels the transactions and stores them in DynamoDb.
   *
   * @protected
   */
  protected createRemodellingStep(): LambdaInvoke {
    const remodellerLambda = new TransactionsRemodellerFunction().create(
      this.stack
    );
    return new LambdaInvoke(this.stack, 'Remodel transactions', {
      lambdaFunction: remodellerLambda,
      inputPath: '$.Payload',
    });
  }

  /**
   * Creates a step that succeeds the state machine.
   *
   * @protected
   */
  protected createSucceedStep(): TransactionProcessingMachineBuilder {
    const succeed = new Succeed(this.stack, 'Succeed');

    this.chainStep(succeed);

    return this;
  }

  /**
   * Creates a step that fails the state machine.
   *
   * @protected
   */
  protected createFailureStep(): Fail {
    return new Fail(this.stack, 'Failure');
  }

  /**
   * Creates the execution role for the state machine.
   *
   * @protected
   */
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
