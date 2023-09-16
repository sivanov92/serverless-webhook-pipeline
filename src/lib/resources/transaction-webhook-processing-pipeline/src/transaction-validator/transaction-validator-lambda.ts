import { Handler } from 'aws-cdk-lib/aws-lambda';
import { APIGatewayEvent } from 'aws-lambda';
import { validateBankTransactions } from './bank-transactions.schema';
import { transformJsonToBankTransactions } from './transform-json-transactions-data.util';
import { BankTransactionsPayload } from '../bank-transactions.types';

export const handler: Handler = (
  event: APIGatewayEvent
): BankTransactionsPayload => {
  if (!event.body) {
    throw new Error('Missing body');
  }

  validateBankTransactions(event.body);

  return transformJsonToBankTransactions(event.body);
};
