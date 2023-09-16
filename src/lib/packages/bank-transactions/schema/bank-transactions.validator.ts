import Ajv from 'ajv';
import { bankTransactionsSchema } from './bank-transactions.schema';
import { BankTransactionsPayload } from '@serverless-pipeline/bank-transactions';

export class BankTransactionsValidator {
  public static validate(bankTransactions: any): void {
    const ajv = new Ajv();
    const validate = ajv.compile(bankTransactionsSchema);
    const transactionsAreValid = validate(bankTransactions);
    if (!transactionsAreValid) {
      throw new Error(
        `Bank transactions are invalid: ${JSON.stringify(validate.errors)}`
      );
    }
  }

  public static parse(transactionsData: any): BankTransactionsPayload {
    const parsedTransactions = (typeof transactionsData === 'string') ?
        JSON.parse(transactionsData) :
        transactionsData;

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
  }
}
