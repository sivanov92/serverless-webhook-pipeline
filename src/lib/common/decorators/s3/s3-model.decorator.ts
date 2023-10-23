import { S3ModelTypes } from './s3-model.types';

export namespace S3Decorators {
  export function S3Model(props: S3ModelTypes) {
    return function (target: any) {
      Reflect.defineMetadata('bucketName', props.bucketName, target);
    };
  }
}
