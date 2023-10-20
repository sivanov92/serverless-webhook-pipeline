import { DynamodbService } from '@serverless-pipeline/dynamo';
import {
  dynamoModelPartitionKeyMetaKey,
  dynamoModelPartitionKeyValueMetaKey,
  dynamoModelSortKeyMetaKey,
  dynamoModelSortKeyValueMetaKey,
  dynamoModelTableNameMetaKey,
} from '../../decorators';

export type DynamoModelPrefix = string | null;

export class DynamoBaseModel<ITEM> {
  protected tableName: string;
  protected partitionKey: string;
  protected partitionKeyValue: string;
  protected sortKey: string;
  protected sortKeyValue: string;

  protected readonly MODEL_KEYS_DELIMITER = '#';

  private dynamoDbService?: DynamodbService;

  /**
   * Creates a new instance of the DynamoBaseModel only through factory method.
   *
   * @private
   */
  private constructor() {}

  public create<ITEM>(): DynamoBaseModel<ITEM> {
    /**
     * Assign the meta values to the class properties.
     */
    this.assignTableName();
    this.assignPartitionKey();
    this.assignPartitionKeyValue();
    this.assignSortKey();
    this.assignSortKeyValue();

    return new DynamoBaseModel<ITEM>();
  }

  private getDynamoDbService(): DynamodbService {
    if (!this.dynamoDbService) {
      this.dynamoDbService = new DynamodbService();
    }
    return this.dynamoDbService;
  }

  protected buildPartitionKey(
    item: ITEM,
    prefix: DynamoModelPrefix = null,
    ...additionalProperties: Array<keyof ITEM>
  ): string {
    /**
     * TODO: Implement this method.
     */
    return '';
  }

  protected buildSortKey(
    item: ITEM,
    prefix: DynamoModelPrefix = null,
    ...additionalProperties: Array<unknown>
  ): string {
    /**
     * TODO: Implement this method.
     */
    return '';
  }

  protected prepareItemsForUpload(items: Array<ITEM>) {
    return items.map((item) => ({
      [this.partitionKey]: this.buildPartitionKey(item),
      [this.sortKey]: this.buildSortKey(item),
      ...item,
    }));
  }

  public async batchCreateItems(items: Array<ITEM>) {
    await this.getDynamoDbService().batchCreateItems(
      this.prepareItemsForUpload(items),
      this.tableName
    );
  }

  private assignTableName(): void {
    if (Reflect.hasMetadata(dynamoModelTableNameMetaKey, this.constructor)) {
      this.tableName = Reflect.getMetadata(
        dynamoModelTableNameMetaKey,
        this.constructor
      );

      return;
    }

    throw new Error(`Table name not found for ${this.constructor.name}`);
  }

  private assignPartitionKey(): void {
    if (Reflect.hasMetadata(dynamoModelPartitionKeyMetaKey, this.constructor)) {
      this.partitionKey = Reflect.getMetadata(
        dynamoModelPartitionKeyMetaKey,
        this.constructor
      );
      return;
    }

    throw new Error(`Partition key not found for ${this.constructor.name}`);
  }

  private assignPartitionKeyValue(): void {
    if (
      Reflect.hasMetadata(dynamoModelPartitionKeyValueMetaKey, this.constructor)
    ) {
      this.partitionKeyValue = Reflect.getMetadata(
        dynamoModelPartitionKeyValueMetaKey,
        this.constructor
      );
      return;
    }

    throw new Error(
      `Partition key value not found for ${this.constructor.name}`
    );
  }

  private assignSortKey(): void {
    if (Reflect.hasMetadata(dynamoModelSortKeyMetaKey, this.constructor)) {
      this.sortKey = Reflect.getMetadata(
        dynamoModelSortKeyMetaKey,
        this.constructor
      );

      return;
    }

    throw new Error(`Sort key not found for ${this.constructor.name}`);
  }

  private assignSortKeyValue(): void {
    if (Reflect.hasMetadata(dynamoModelSortKeyValueMetaKey, this.constructor)) {
      this.sortKeyValue = Reflect.getMetadata(
        dynamoModelSortKeyValueMetaKey,
        this.constructor
      );

      return;
    }

    throw new Error(`Sort key value not found for ${this.constructor.name}`);
  }
}
