import {
  AttributeType,
  BillingMode,
  Table,
  TableEncryption,
} from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { TRANSACTIONS_REMODELLED_TABLE_NAME } from '../../../../packages/bank-transactions';

export class FormattedTransactionsTable {
  public static readonly partitionKey: string = 'PK';
  public static readonly sortKey: string = 'SK';

  public static createTable(stack: Stack): Table {
    return new Table(stack, TRANSACTIONS_REMODELLED_TABLE_NAME, {
      tableName: TRANSACTIONS_REMODELLED_TABLE_NAME,
      partitionKey: {
        name: FormattedTransactionsTable.partitionKey,
        type: AttributeType.STRING,
      },
      sortKey: {
        name: FormattedTransactionsTable.sortKey,
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
    });
  }
}
