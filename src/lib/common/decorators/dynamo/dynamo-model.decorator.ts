import { DynamoModelTypes } from './dynamo-models.types';

export namespace DynamoDecorators {
  export function DynamoModel(props: DynamoModelTypes) {
    return function (target: any) {
      Reflect.defineMetadata('tableName', props.tableName, target);
      Reflect.defineMetadata('partitionKey', props.partitionKey, target);
      Reflect.defineMetadata(
        'partitionKeyProperty',
        props.partitionKeyProperty,
        target
      );
      Reflect.defineMetadata(
        'partitionKeyPrefix',
        props.partitionKeyPrefix ?? null,
        target
      );
      Reflect.defineMetadata('sortKey', props.sortKey, target);
      Reflect.defineMetadata('sortKeyProperty', props.sortKeyProperty, target);
      Reflect.defineMetadata(
        'sortKeyPrefix',
        props.sortKeyPrefix ?? null,
        target
      );
    };
  }
}
