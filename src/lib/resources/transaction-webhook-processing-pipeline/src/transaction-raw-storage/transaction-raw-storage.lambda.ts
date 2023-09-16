import { BankTransactionsPayload } from '@serverless-pipeline/bank-transactions';
import { bucketKeyGeneratorUtil } from './bucket-key-generator.util';
import { S3Service } from '../../../../integrations/s3';
import { RawTransactionsBucket } from '../../infrastructure/storage';

export const handler = async (event: BankTransactionsPayload): Promise<void> => {
  try {
    const bucketKey = bucketKeyGeneratorUtil(event);

    const s3Service = new S3Service();
    await s3Service.saveObject(
        RawTransactionsBucket.bucketName,
        bucketKey,
        JSON.stringify(event)
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
