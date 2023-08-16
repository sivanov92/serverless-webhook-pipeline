import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { S3ConfigParams } from './s3.types';
import { S3Exception } from './s3.exception';

export class S3Service {
  private readonly client: S3;
  private readonly DEFAULT_REGION = 'eu-central-1';

  constructor(config?: S3ConfigParams) {
    const region = config?.region ?? this.DEFAULT_REGION;

    this.client = new S3({
      region,
    });
  }

  public async saveObject(
    bucket: string,
    key: string,
    body: string
  ): Promise<PutObjectCommandOutput> {
    const result = await this.client.putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
    });

    if (!result) {
      throw S3Exception.couldNotSaveObject(key, bucket);
    }

    return result;
  }
}
