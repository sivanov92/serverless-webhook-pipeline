import { BaseLambdaFunction } from '../../../../common';
import * as path from 'path';
import { LambdaDecorators } from '../../../../common/decorators';

@LambdaDecorators.Lambda({
  name: 'TransactionValidatorFunction',
  functionSourcePath: path.join(
    __dirname,
    '../../src/transaction-validator/transaction-validator.lambda.ts'
  ),
})
export class TransactionValidatorFunction extends BaseLambdaFunction {}
