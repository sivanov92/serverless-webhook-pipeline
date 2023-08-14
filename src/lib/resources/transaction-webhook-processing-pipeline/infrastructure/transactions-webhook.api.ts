import { Stack } from 'aws-cdk-lib';
import { RestApi, StepFunctionsRestApi } from 'aws-cdk-lib/aws-apigateway';
import { TransactionProcessingMachineBuilder } from './transaction-processing.machine';

export class TransactionsWebhookApi {
  public static create(stack: Stack): RestApi {
    const stateMachineBuilder = new TransactionProcessingMachineBuilder();

    const api = new StepFunctionsRestApi(stack, 'Transactions webhook API', {
      restApiName: 'Transactions webhook API',
      deploy: true,
      stateMachine: stateMachineBuilder.build(stack),
    });

    const bankTransactionsResource = api.root.addResource('bank-transactions');
    bankTransactionsResource.addMethod('POST');

    return api;
  }
}
