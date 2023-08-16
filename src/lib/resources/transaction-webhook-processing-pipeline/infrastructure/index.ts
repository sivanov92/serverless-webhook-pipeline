import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export interface TransactionApiProps {
  rawTransactionsBucket: Bucket;
  formattedTransactionsTable: Table;
}

export * from './transaction-webhook-processing-pipeline.stack';
