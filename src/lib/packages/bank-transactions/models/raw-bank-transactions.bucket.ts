import { S3BaseModel } from '@serverless-pipeline/common';
import { S3Decorators } from '@serverless-pipeline/s3-decorators';

@S3Decorators.S3Model({
  bucketName: 'raw-bank-transactions-bucket',
})
export class RawBankTransactionsBucket extends S3BaseModel {}
