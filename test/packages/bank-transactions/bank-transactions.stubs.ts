export const validBankTransactionsRawStub = {
  bank_account_id: 'bank_account_id',
  iban: 'iban',
  bank_name: 'bank_name',
  currency: 'currency',
  items: [
    {
      transaction_id: 'transaction_id',
      amount: 100,
      sender: 'sender',
      statement_descriptor: 'statement_descriptor',
    },
  ],
};

export const invalidBankTransactionsRawStub = {
  bank_account_id: null,
  iban: 12121,
  bank_name: null,
};

export const validBankTransactionsPayloadStub = {
  bankAccountId: 'bank_account_id',
  iban: 'iban',
  bankName: 'bank_name',
  currency: 'currency',
  items: [
    {
      transactionId: 'transaction_id',
      amount: 100,
      sender: 'sender',
      statementDescriptor: 'statement_descriptor',
    },
  ],
};
