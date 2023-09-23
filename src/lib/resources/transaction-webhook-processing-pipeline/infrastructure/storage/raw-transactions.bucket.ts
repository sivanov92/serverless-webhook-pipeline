import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  LifecycleRule,
  ObjectOwnership,
  StorageClass,
} from 'aws-cdk-lib/aws-s3';
import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { TRANSACTIONS_RAW_BUCKET_NAME } from '../../../../packages/bank-transactions';

export class RawTransactionsBucket {
  public static createBucket(stack: Stack): Bucket {
    return new Bucket(stack, TRANSACTIONS_RAW_BUCKET_NAME, {
      bucketName: TRANSACTIONS_RAW_BUCKET_NAME,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      autoDeleteObjects: true,
      lifecycleRules: RawTransactionsBucket.buildLifecycleRules(),
    });
  }

  protected static buildLifecycleRules(): Array<LifecycleRule> {
    return [
      {
        enabled: true,
        id: 'Move to Glacier Flexible - Archive purpose',
        transitions: [
          {
            storageClass: StorageClass.GLACIER,
            transitionAfter: Duration.days(30),
          },
        ],
      },
    ];
  }
}
