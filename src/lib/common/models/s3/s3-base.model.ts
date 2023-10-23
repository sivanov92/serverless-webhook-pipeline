import { s3BucketNameMetaKey } from '../../decorators/s3';
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  LifecycleRule,
  ObjectOwnership,
  StorageClass,
} from 'aws-cdk-lib/aws-s3';
import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { S3Service } from '@serverless-pipeline/s3';

export class S3BaseModel {
  protected bucketName: string;

  private s3Service?: S3Service;

  public constructor() {
    this.assignBucketNameProperty();
  }

  private getS3Service(): S3Service {
    if (!this.s3Service) {
      this.s3Service = new S3Service();
    }
    return this.s3Service;
  }

  public static create(): S3BaseModel {
    return new S3BaseModel();
  }

  public static createBucket(stack: Stack): Bucket {
    const model = this.create();
    return new Bucket(stack, model.bucketName, {
      bucketName: model.bucketName,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      autoDeleteObjects: true,
      lifecycleRules: this.createLifecycleRules(),
    });
  }

  protected static createLifecycleRules(): Array<LifecycleRule> {
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

  public async saveObject(key: string, body: string): Promise<void> {
    await this.getS3Service().saveObject(this.bucketName, key, body);
  }

  private assignBucketNameProperty(): void {
    if (Reflect.hasMetadata(s3BucketNameMetaKey, this.constructor)) {
      this.bucketName = Reflect.getMetadata(
        s3BucketNameMetaKey,
        this.constructor
      );

      return;
    }

    throw new Error(
      `S3 bucket name property not found for ${this.constructor.name}`
    );
  }
}
