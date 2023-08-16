import { BankTransactionsPayload } from '../bank-transactions.types';

export const bucketKeyGeneratorUtil = (
  transactionsPayload: BankTransactionsPayload
): string => {
  return `${transactionsPayload.bankAccountId}_${
    transactionsPayload.iban
  }_${getCurrentTime()}`;
};

const getCurrentTime = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
};
