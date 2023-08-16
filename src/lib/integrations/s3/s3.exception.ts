export enum S3ErrorCodes {
  COULD_NOT_SAVE_OBJECT = 'COULD_NOT_SAVE_OBJECT',
}

export class S3Exception extends Error {
  constructor(
    public readonly code: S3ErrorCodes,
    public readonly message: string
  ) {
    super(`S3Exception: ${code} - ${message}`);
  }

  public static couldNotSaveObject(key: string, bucket: string) {
    return new S3Exception(
      S3ErrorCodes.COULD_NOT_SAVE_OBJECT,
      `Could not create item with key ${key} in bucket ${bucket}`
    );
  }
}
