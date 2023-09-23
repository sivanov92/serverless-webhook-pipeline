import { describe, expect, it } from '@jest/globals';
import {
  invalidBankTransactionsRawStub,
  validBankTransactionsRawStub,
} from './bank-transactions.stubs';
import { BankTransactionsValidator } from '../../../src/lib/packages/bank-transactions';

describe('Test bank transactions validator', () => {
  describe('Validate', () => {
    it('should fail validation', () => {
      expect(() => {
        BankTransactionsValidator.validate(invalidBankTransactionsRawStub);
      }).toThrow();
    });

    it('should pass validation', () => {
      BankTransactionsValidator.validate(validBankTransactionsRawStub);

      expect(true).toBeTruthy();
    });
  });

  describe('Parse', () => {
    it('should parse bank transactions', () => {
      const bankTransactions = BankTransactionsValidator.parse(
        validBankTransactionsRawStub
      );

      expect(bankTransactions.bankAccountId).toEqual(
        validBankTransactionsRawStub.bank_account_id
      );
      expect(bankTransactions.iban).toEqual(validBankTransactionsRawStub.iban);
      expect(bankTransactions.bankName).toEqual(
        validBankTransactionsRawStub.bank_name
      );
      expect(bankTransactions.currency).toEqual(
        validBankTransactionsRawStub.currency
      );
      expect(bankTransactions.items[0].transactionId).toEqual(
        validBankTransactionsRawStub.items[0].transaction_id
      );
      expect(bankTransactions.items[0].amount).toEqual(
        validBankTransactionsRawStub.items[0].amount
      );
      expect(bankTransactions.items[0].sender).toEqual(
        validBankTransactionsRawStub.items[0].sender
      );
      expect(bankTransactions.items[0].statementDescriptor).toEqual(
        validBankTransactionsRawStub.items[0].statement_descriptor
      );
    });
  });
});
