import { BaseLambdaFunction } from '../../../../common';
import * as path from 'path';
import { LambdaDecorators } from '../../../../common/decorators';

@LambdaDecorators.Lambda({
  name: 'TransactionsRemodellerFunction',
  functionSourcePath: path.join(
    __dirname,
    '../../src/transaction-remodeller/transaction-remodeller.lambda.ts'
  ),
  permissions: ['dynamodb:BatchWriteItem'],
})
export class TransactionsRemodellerFunction extends BaseLambdaFunction {}
