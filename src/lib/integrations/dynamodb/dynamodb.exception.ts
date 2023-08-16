export enum DynamodbErrorCodes {
  COULD_NOT_CREATE_ITEM = 'COULD_NOT_CREATE_ITEM',
}

export class DynamodbException extends Error {
  constructor(
    public readonly code: DynamodbErrorCodes,
    public readonly message: string
  ) {
    super(`DynamodbException: ${code} - ${message}`);
  }

  public static couldNotCreateItem(partitionKey: string, tableName: string) {
    return new DynamodbException(
      DynamodbErrorCodes.COULD_NOT_CREATE_ITEM,
      `Could not create item with partition key ${partitionKey} in table ${tableName}`
    );
  }
}
