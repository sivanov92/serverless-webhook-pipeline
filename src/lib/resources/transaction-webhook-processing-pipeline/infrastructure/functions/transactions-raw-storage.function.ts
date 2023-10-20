import { BaseLambdaFunction } from '../../../../common';
import * as path from 'path';
import { LambdaDecorators } from '../../../../common/decorators';

@LambdaDecorators.Lambda({
  name: 'TransactionsRawStorageFunction',
  functionSourcePath: path.join(
    __dirname,
    '../../src/transaction-raw-storage/transaction-raw-storage.lambda.ts'
  ),
  permissions: ['s3:PutObject'],
})
export class TransactionsRawStorageFunction extends BaseLambdaFunction {}
