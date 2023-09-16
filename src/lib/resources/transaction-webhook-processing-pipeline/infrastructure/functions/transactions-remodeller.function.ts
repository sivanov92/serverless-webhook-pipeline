import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionsRemodellerFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionsRemodellerFunction';
  protected readonly functionSourceCodeFile =
    'transaction-remodeller-lambda.ts';
  protected readonly directoryName = 'transaction-remodeller';

  protected getFunctionPath(): string {
    return path.join(
      __dirname,
      '../../src',
      this.directoryName,
      this.functionSourceCodeFile
    );
  }
}
