import { BankTransactionsPayload } from '../bank-transactions.types';
import { bucketKeyGeneratorUtil } from './bucket-key-generator.util';
import { S3Service } from '../../../../integrations/s3';
import { RawTransactionsBucket } from '../../infrastructure/storage';

export const handler = async (event: BankTransactionsPayload): Promise<void> => {
  const bucketKey = bucketKeyGeneratorUtil(event);

  const s3Service = new S3Service();
  await s3Service.saveObject(
    RawTransactionsBucket.bucketName,
    bucketKey,
    JSON.stringify(event)
  );
};
