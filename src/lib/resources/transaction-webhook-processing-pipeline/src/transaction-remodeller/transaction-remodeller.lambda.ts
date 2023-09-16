import { BankTransactionsPayload, BankTransaction } from '@serverless-pipeline/bank-transactions';

export const handler = async (event: BankTransactionsPayload) => {
  try {
    await BankTransaction.batchCreateItems(event);
  } catch (error) {
    console.error(error);
  }
};
