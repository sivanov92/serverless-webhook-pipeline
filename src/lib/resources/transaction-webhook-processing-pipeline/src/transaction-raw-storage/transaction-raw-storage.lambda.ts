import { bucketKeyGeneratorUtil } from './bucket-key-generator.util';
import { S3Service } from '@serverless-pipeline/s3';
import {
  TRANSACTIONS_RAW_BUCKET_NAME,
  BankTransactionsPayload,
} from '@serverless-pipeline/bank-transactions';

export const handler = async (
  event: BankTransactionsPayload
): Promise<void> => {
  console.log('TransactionRawStorageLambda: Received event', event);
  const bucketKey = bucketKeyGeneratorUtil(event);

  const s3Service = new S3Service();
  await s3Service.saveObject(
    TRANSACTIONS_RAW_BUCKET_NAME,
    bucketKey,
    JSON.stringify(event)
  );
};
