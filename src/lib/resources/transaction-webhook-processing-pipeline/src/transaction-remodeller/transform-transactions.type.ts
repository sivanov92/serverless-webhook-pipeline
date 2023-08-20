export interface TransformTransactionsType {
  PK: string;
  SK: string;
  bankAccountId: string;
  iban: string;
  amount: number;
  currency: string;
  transactionId: string;
  bankName: string;
  otherData?: any;
}
