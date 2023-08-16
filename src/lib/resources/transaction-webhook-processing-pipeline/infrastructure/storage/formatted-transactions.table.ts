import {
  AttributeType,
  BillingMode,
  Table,
  TableEncryption,
} from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';

export class FormattedTransactionsTable {
  public static readonly tableName: string = 'formatted-transactions-table';
  public static readonly partitionKey: string = 'PK';
  public static readonly sortKey: string = 'SK';
  private table: Table;

  public getTable(): Table {
    return this.table;
  }

  public createTable(stack: Stack): FormattedTransactionsTable {
    const table = new Table(stack, FormattedTransactionsTable.tableName, {
      tableName: FormattedTransactionsTable.tableName,
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

    this.table = table;

    return this;
  }
}
