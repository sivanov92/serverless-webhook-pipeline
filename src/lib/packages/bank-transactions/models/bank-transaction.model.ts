import {
  BankTransactionsPayload,
  TransformedTransaction,
} from '../bank-transactions.types';
import { DynamodbService } from '../../../integrations/dynamodb';
import { TRANSACTIONS_REMODELLED_TABLE_NAME } from '../bank-transactions.config';

export class BankTransaction {
  private static readonly PARTITION_KEY = 'PK';
  private static readonly SORT_KEY = 'SK';
  private static readonly PARTITION_KEY_PREFIX = 'IBAN#';
  private static readonly SORT_KEY_PREFIX = 'TRANSACTION#';

  public static createItems(
    transactionData: BankTransactionsPayload
  ): TransformedTransaction[] {
    return transactionData.items.map((item) => {
      const { amount, transactionId, ...otherData } = item;

      return {
        [this.PARTITION_KEY]: this.buildPartitionKey(transactionData.iban),
        [this.SORT_KEY]: this.buildSortKey(transactionId),
        bankAccountId: transactionData.bankAccountId,
        iban: transactionData.iban,
        amount: item.amount,
        currency: transactionData.currency,
        transactionId: item.transactionId,
        bankName: transactionData.bankName,
        otherData,
      };
    });
  }

  protected static buildPartitionKey(iban: string): string {
    return `${this.PARTITION_KEY_PREFIX}${iban}`;
  }

  protected static buildSortKey(transactionId: string): string {
    const timestamp = new Date().toISOString();
    return `${this.SORT_KEY_PREFIX}${transactionId}#${timestamp}`;
  }

  public static async batchCreateItems(
    transactionData: BankTransactionsPayload
  ) {
    const items = this.createItems(transactionData);

    const dynamoDbService = new DynamodbService();
    await dynamoDbService.batchCreateItems(
      items,
      TRANSACTIONS_REMODELLED_TABLE_NAME
    );
  }
}
