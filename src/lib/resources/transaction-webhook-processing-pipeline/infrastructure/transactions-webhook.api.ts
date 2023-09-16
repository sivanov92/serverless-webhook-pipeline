import { Stack } from 'aws-cdk-lib';
import { RestApi, StepFunctionsRestApi } from 'aws-cdk-lib/aws-apigateway';
import { TransactionProcessingMachineBuilder } from './transaction-processing.steps';
import { TransactionApiProps } from './index';

export class TransactionsWebhookApi {
  public static create(stack: Stack, params: TransactionApiProps): RestApi {
    const stateMachineBuilder = new TransactionProcessingMachineBuilder();

    const api = new StepFunctionsRestApi(stack, 'Transactions webhook API', {
      restApiName: 'Transactions webhook API',
      deploy: true,
      stateMachine: stateMachineBuilder.build(stack, params),
    });

    const bankTransactionsResource = api.root.addResource('bank-transactions');
    bankTransactionsResource.addMethod('POST');

    return api;
  }
}
