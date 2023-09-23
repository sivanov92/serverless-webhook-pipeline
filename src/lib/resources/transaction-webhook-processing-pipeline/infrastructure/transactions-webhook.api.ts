import { Stack } from 'aws-cdk-lib';
import { RestApi, StepFunctionsIntegration } from 'aws-cdk-lib/aws-apigateway';
import { TransactionProcessingMachineBuilder } from './functions/transaction-processing.steps';

export class TransactionsWebhookApi {
  /**
   * Creates the API with the state machine that processes the transactions.
   *
   * @param stack
   */
  public static create(stack: Stack): RestApi {
    const stateMachineBuilder = new TransactionProcessingMachineBuilder();
    const stateMachine = stateMachineBuilder.build(stack);

    const api = new RestApi(stack, 'Transactions webhook API', {
      restApiName: 'Transactions webhook API',
      deploy: true,
    });

    const bankTransactionsResource = api.root.addResource('bank-transactions');
    bankTransactionsResource.addMethod(
      'POST',
      StepFunctionsIntegration.startExecution(stateMachine)
    );

    return api;
  }
}
