import { AssetCode, Code } from 'aws-cdk-lib/aws-lambda';
import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionsRemodellerFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionsRemodellerFunction';
  protected readonly functionSourceCodeFile = 'transaction-remodeller.lambda';
  protected readonly directoryName = 'transaction-remodeller';

  protected getFunctionPath(): AssetCode {
    return Code.fromAsset(
      path.join(__dirname, '../../src', this.directoryName)
    );
  }
}
