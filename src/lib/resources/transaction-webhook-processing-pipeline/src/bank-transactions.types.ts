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