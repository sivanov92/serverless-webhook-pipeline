import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TransactionsWebhookApi } from './transactions-webhook.api';
import { FormattedTransactionsTable, RawTransactionsBucket } from './storage';

export class TransactionWebhookProcessingPipelineStack extends Stack {
  static readonly STACK_NAME = 'TransactionWebhookProcessingPipelineStack';

  constructor(scope: Construct, props?: StackProps) {
    super(scope, TransactionWebhookProcessingPipelineStack.STACK_NAME, props);

    const storageBucketManager = new RawTransactionsBucket();
    storageBucketManager.createBucket(this);

    const dynamoTableManager = new FormattedTransactionsTable();
    dynamoTableManager.createTable(this);

    /**
     * Creates the API with the state machine that processes the transactions.
     */
    TransactionsWebhookApi.create(this);

    Tags.of(this).add('project', 'transaction-webhook-processing-pipeline');
  }
}
