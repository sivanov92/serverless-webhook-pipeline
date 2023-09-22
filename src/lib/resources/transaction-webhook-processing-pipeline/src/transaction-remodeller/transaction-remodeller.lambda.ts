import {
  BankTransaction,
  BankTransactionsPayload,
} from '@serverless-pipeline/bank-transactions';

export const handler = async (event: BankTransactionsPayload) => {
  await BankTransaction.batchCreateItems(event);
};
