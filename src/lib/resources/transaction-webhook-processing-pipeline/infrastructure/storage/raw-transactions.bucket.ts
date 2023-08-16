import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  LifecycleRule,
  ObjectOwnership, StorageClass,
} from 'aws-cdk-lib/aws-s3';
import {Duration, RemovalPolicy, Stack} from 'aws-cdk-lib';

export class RawTransactionsBucket {
  public static readonly bucketName: string = 'raw-transactions-bucket';
  private bucket: Bucket;

  public getBucket(): Bucket {
    return this.bucket;
  }

  public createBucket(stack: Stack): RawTransactionsBucket {
    const bucket = new Bucket(stack, RawTransactionsBucket.bucketName, {
      bucketName: RawTransactionsBucket.bucketName,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      autoDeleteObjects: true,
      lifecycleRules: this.buildLifecycleRules(),
    });

    this.bucket = bucket;

    return this;
  }

  protected buildLifecycleRules(): Array<LifecycleRule> {
    return [
      {
        enabled: true,
        id: 'Move to Glacier Flexible - Archive purpose',
        transitions: [
          {
            storageClass: StorageClass.GLACIER,
            transitionAfter: Duration.days(30),
          }
        ]
      }
    ]
  }

  protected buildResourceBasedPolicy(): void {
    //TODO Role
  }
}
