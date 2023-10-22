import { DynamodbService } from '@serverless-pipeline/dynamo';
import {
  dynamoModelPartitionKeyMetaKey,
  dynamoModelPartitionKeyPrefixMetaKey,
  dynamoModelPartitionKeyPropertyMetaKey,
  dynamoModelSortKeyMetaKey,
  dynamoModelSortKeyPrefixMetaKey,
  dynamoModelSortKeyPropertyMetaKey,
  dynamoModelTableNameMetaKey,
} from '../../decorators';

export type DynamoModelPrefix = string | null;

export class DynamoBaseModel<ITEM> {
  protected tableName: string;

  protected partitionKey: string;
  protected partitionKeyProperty: keyof ITEM;
  protected partitionKeyPrefix: DynamoModelPrefix = null;

  protected sortKey: string;
  protected sortKeyProperty: keyof ITEM;
  protected sortKeyPrefix: DynamoModelPrefix = null;

  protected readonly MODEL_KEYS_DELIMITER = '#';

  private dynamoDbService?: DynamodbService;

  public constructor() {
    /**
     * Assign the meta values to the class properties.
     */
    this.assignTableName();
    this.assignPartitionKey();
    this.assignPartitionKeyProperty();
    this.assignPartitionKeyPrefix();

    this.assignSortKey();
    this.assignSortKeyProperty();
    this.assignSortKeyPrefix();
  }

  public static create<ITEM>(): DynamoBaseModel<ITEM> {
    return new DynamoBaseModel<ITEM>();
  }

  private getDynamoDbService(): DynamodbService {
    if (!this.dynamoDbService) {
      this.dynamoDbService = new DynamodbService();
    }
    return this.dynamoDbService;
  }

  public getTableName(): string {
    return this.tableName;
  }

  protected buildPartitionKey(
    item: ITEM,
    ...additionalProperties: Array<keyof ITEM>
  ): string {
    const mainPropertyValue = item[this.partitionKeyProperty];
    const partitionKeyComponents = [
      this.partitionKeyPrefix,
      mainPropertyValue,
      ...additionalProperties,
    ];

    return partitionKeyComponents
      .filter(Boolean)
      .join(this.MODEL_KEYS_DELIMITER);
  }

  protected buildSortKey(
    item: ITEM,
    ...additionalProperties: Array<unknown>
  ): string {
    const mainPropertyValue = item[this.sortKeyProperty];
    const sortKeyComponents = [
      this.sortKeyPrefix,
      mainPropertyValue,
      ...additionalProperties,
    ];

    return sortKeyComponents.filter(Boolean).join(this.MODEL_KEYS_DELIMITER);
  }

  protected prepareItemsForUpload(items: Array<ITEM>) {
    const timestamp = new Date().toISOString();

    return items.map((item) => ({
      [this.partitionKey]: this.buildPartitionKey(item),
      [this.sortKey]: this.buildSortKey(item, timestamp),
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

  private assignPartitionKeyProperty(): void {
    if (
      Reflect.hasMetadata(
        dynamoModelPartitionKeyPropertyMetaKey,
        this.constructor
      )
    ) {
      this.partitionKeyProperty = Reflect.getMetadata(
        dynamoModelPartitionKeyPropertyMetaKey,
        this.constructor
      );
      return;
    }

    throw new Error(
      `Partition key property not found for ${this.constructor.name}`
    );
  }

  private assignPartitionKeyPrefix(): void {
    if (
      Reflect.hasMetadata(
        dynamoModelPartitionKeyPrefixMetaKey,
        this.constructor
      )
    ) {
      this.partitionKeyPrefix = Reflect.getMetadata(
        dynamoModelPartitionKeyPrefixMetaKey,
        this.constructor
      );
      return;
    }

    throw new Error(
      `Partition key prefix not found for ${this.constructor.name}`
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

  private assignSortKeyProperty(): void {
    if (
      Reflect.hasMetadata(dynamoModelSortKeyPropertyMetaKey, this.constructor)
    ) {
      this.sortKeyProperty = Reflect.getMetadata(
        dynamoModelSortKeyPropertyMetaKey,
        this.constructor
      );

      return;
    }

    throw new Error(`Sort key property not found for ${this.constructor.name}`);
  }

  private assignSortKeyPrefix(): void {
    if (
      Reflect.hasMetadata(dynamoModelSortKeyPrefixMetaKey, this.constructor)
    ) {
      this.sortKeyProperty = Reflect.getMetadata(
        dynamoModelSortKeyPrefixMetaKey,
        this.constructor
      );

      return;
    }

    throw new Error(`Sort key prefix not found for ${this.constructor.name}`);
  }
}
