import { DynamoDecorators } from '@serverless-pipeline/dynamo-decorators';
import { DynamoBaseModel } from '@serverless-pipeline/common';
import { BankTransactionsPayload } from '@serverless-pipeline/bank-transactions';

@DynamoDecorators.DynamoModel({
  tableName: 'bank-transactions',
  partitionKey: 'PK',
  partitionKeyProperty: 'iban',
  partitionKeyPrefix: 'iban',
  sortKey: 'SK',
  sortKeyProperty: 'transactionId',
  sortKeyPrefix: 'transaction',
})
export class BankTransaction extends DynamoBaseModel<BankTransactionsPayload> {}
