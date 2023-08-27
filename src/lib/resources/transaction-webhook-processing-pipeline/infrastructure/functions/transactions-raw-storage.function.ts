import { AssetCode, Code } from 'aws-cdk-lib/aws-lambda';
import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionsRawStorageFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionsRawStorageFunction';
  protected readonly functionSourceCodeFile = 'transaction-raw-storage-lambda';
  protected readonly directoryName = 'transaction-raw-storage';

  protected getFunctionPath(): AssetCode {
    return Code.fromAsset(
      path.join(__dirname, '../../src', this.directoryName)
    );
  }
}
