import { Handler } from 'aws-cdk-lib/aws-lambda';
import { APIGatewayEvent } from 'aws-lambda';
import {
  BankTransactionsPayload,
  BankTransactionsValidator,
} from '@serverless-pipeline/bank-transactions';

export const handler: Handler = async (
  event: APIGatewayEvent
): Promise<BankTransactionsPayload> => {
  if (!event.body) {
    throw new Error('Missing body');
  }

  BankTransactionsValidator.validate(event.body);
  return BankTransactionsValidator.parse(event.body);
};
