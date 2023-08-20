import { BankTransactionsPayload } from '../bank-transactions.types';
import { TransformedTransactionItemModel } from './transformed-transaction-item.model';

export const handler = async (event: BankTransactionsPayload) => {
  try {
    await TransformedTransactionItemModel.batchCreateItems(event);
  } catch (error) {
    console.error(error);
  }
};
