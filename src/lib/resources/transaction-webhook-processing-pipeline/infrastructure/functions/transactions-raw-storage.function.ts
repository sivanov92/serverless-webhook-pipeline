import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionsRawStorageFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionsRawStorageFunction';
  protected readonly functionSourceCodeFile =
    'transaction-raw-storage.lambda.ts';
  protected readonly directoryName = 'transaction-raw-storage';

  protected getFunctionPath(): string {
    return path.join(
      __dirname,
      '../../src',
      this.directoryName,
      this.functionSourceCodeFile
    );
  }
}
