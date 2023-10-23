import {
  BankTransaction,
  BankTransactionsPayload,
} from '@serverless-pipeline/bank-transactions';

export const handler = async (event: BankTransactionsPayload) => {
  const formattedItems = event.items.map((item) => {
    const { amount, transactionId, ...otherData } = item;
    return {
      bankAccountId: event.bankAccountId,
      iban: event.iban,
      amount: item.amount,
      currency: event.currency,
      transactionId: item.transactionId,
      bankName: event.bankName,
      otherData,
    };
  });

  const bankTransactionModel = BankTransaction.create();
  await bankTransactionModel.batchCreateItems(formattedItems);
};
