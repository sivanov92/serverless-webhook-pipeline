import { bucketKeyGeneratorUtil } from './bucket-key-generator.util';
import {
  BankTransactionsPayload,
  RawBankTransactionsBucket,
} from '@serverless-pipeline/bank-transactions';

export const handler = async (
  event: BankTransactionsPayload
): Promise<void> => {
  console.log('TransactionRawStorageLambda: Received event', event);
  const bucketKey = bucketKeyGeneratorUtil(event);

  const s3model = RawBankTransactionsBucket.create();
  await s3model.saveObject(bucketKey, JSON.stringify(event));
};
