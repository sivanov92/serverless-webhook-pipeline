import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamodbConfigParams } from './dynamodb.types';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamodbException } from './dynamodb.exception';

export class DynamodbService {
  private client: DynamoDB;
  private readonly DEFAULT_REGION = 'eu-central-1';

  constructor(config?: DynamodbConfigParams) {
    this.client = new DynamoDB({
      region: config?.region ?? this.DEFAULT_REGION,
    });
  }

  public async createItem(item: any, tableName: string) {
    const params = {
      TableName: tableName,
      Item: marshall(item),
    };

    const result = await this.client.putItem(params);
    if (!result) {
      throw DynamodbException.couldNotCreateItem(item.PK, tableName);
    }
  }
}
