import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TransactionsWebhookApi } from './transactions-webhook.api';
import { FormattedTransactionsTable, RawTransactionsBucket } from './storage';

export class TransactionWebhookProcessingPipelineStack extends Stack {
  static readonly STACK_NAME = 'TransactionWebhookProcessingPipelineStack';

  constructor(scope: Construct, props?: StackProps) {
    super(scope, TransactionWebhookProcessingPipelineStack.STACK_NAME, props);

    const storageBucketManager = new RawTransactionsBucket();
    const bucket = storageBucketManager.createBucket(this).getBucket();

    const dynamoTableManager = new FormattedTransactionsTable();
    const table = dynamoTableManager.createTable(this).getTable();

    /**
     * Creates the API with the state machine that processes the transactions.
     */
    TransactionsWebhookApi.create(this, {
      rawTransactionsBucket: bucket,
      formattedTransactionsTable: table,
    });

    Tags.of(this).add('project', 'transaction-webhook-processing-pipeline');
  }
}
