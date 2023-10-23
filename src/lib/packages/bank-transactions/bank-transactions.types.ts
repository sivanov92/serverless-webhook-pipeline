export interface BankTransactionsPayload {
  bankAccountId: string;
  iban: string;
  bankName: string;
  currency: string;
  items: Array<BankTransactionItem>;
}

export interface BankTransactionItem {
  transactionId: string;
  amount: number;
  sender: string;
  statementDescriptor: string;
}

export interface TransformedTransaction {
  PK: string;
  SK: string;
  bankAccountId: string;
  iban: string;
  amount: number;
  currency: string;
  transactionId: string;
  bankName: string;
  otherData?: Record<string, any>;
}
