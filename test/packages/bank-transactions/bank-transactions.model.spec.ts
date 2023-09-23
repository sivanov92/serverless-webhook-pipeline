import { describe, expect, it } from '@jest/globals';
import { BankTransaction } from '../../../src/lib/packages/bank-transactions';
import { validBankTransactionsPayloadStub } from './bank-transactions.stubs';

describe('Test bank transactions model', () => {
  describe('CreateItems', () => {
    it('should create transformed transactions', () => {
      const transformedTransactions = BankTransaction.createItems(
        validBankTransactionsPayloadStub
      );
      expect(transformedTransactions.length).toEqual(1);

      expect(transformedTransactions[0].PK).toEqual(
        `IBAN#${validBankTransactionsPayloadStub.iban}`
      );
      expect(transformedTransactions[0].SK).toMatch('TRANSACTION#');
      expect(transformedTransactions[0].bankAccountId).toEqual(
        validBankTransactionsPayloadStub.bankAccountId
      );
      expect(transformedTransactions[0].iban).toEqual(
        validBankTransactionsPayloadStub.iban
      );
      expect(transformedTransactions[0].bankName).toEqual(
        validBankTransactionsPayloadStub.bankName
      );
      expect(transformedTransactions[0].currency).toEqual(
        validBankTransactionsPayloadStub.currency
      );
      expect(transformedTransactions[0].amount).toEqual(
        validBankTransactionsPayloadStub.items[0].amount
      );
      expect(transformedTransactions[0].transactionId).toEqual(
        validBankTransactionsPayloadStub.items[0].transactionId
      );
      expect(transformedTransactions[0].otherData!.sender).toEqual(
        validBankTransactionsPayloadStub.items[0].sender
      );
      expect(transformedTransactions[0].otherData!.statementDescriptor).toEqual(
        validBankTransactionsPayloadStub.items[0].statementDescriptor
      );
    });
  });
});
