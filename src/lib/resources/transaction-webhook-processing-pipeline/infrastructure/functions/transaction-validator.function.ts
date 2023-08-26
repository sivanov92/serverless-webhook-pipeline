import { AssetCode, Code } from 'aws-cdk-lib/aws-lambda';
import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionValidatorFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionValidatorFunction';
  protected readonly functionSourceCodeFile = 'transaction-validator.lambda';
  protected readonly directoryName = 'transaction-validator';

  protected getFunctionPath(): AssetCode {
    return Code.fromAsset(
      path.join(__dirname, '../../src', this.directoryName)
    );
  }
}
