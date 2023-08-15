import { BankTransactionsPayload } from '../bank-transactions.types';

export const transformJsonToBankTransactions = (
  parsedTransactions: any,
): BankTransactionsPayload => {
  return {
    bankAccountId: parsedTransactions.bank_account_id,
    iban: parsedTransactions.iban,
    bankName: parsedTransactions.bank_name,
    currency: parsedTransactions.currency,
    items: parsedTransactions.items.map((item: any) => {
      return {
        transactionId: item.transaction_id,
        amount: item.amount,
        sender: item.sender,
        statementDescriptor: item.statement_descriptor,
      };
    }),
  };
};
