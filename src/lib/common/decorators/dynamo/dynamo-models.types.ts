export type DynamoModelTypes = {
  tableName: string;
  partitionKey: string;
  partitionKeyProperty: string;
  partitionKeyPrefix?: string;
  sortKey: string;
  sortKeyProperty: string;
  sortKeyPrefix?: string;
};
