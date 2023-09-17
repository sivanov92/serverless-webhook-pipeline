import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionValidatorFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionValidatorFunction';
  protected readonly functionSourceCodeFile = 'transaction-validator.lambda.ts';
  protected readonly directoryName = 'transaction-validator';

  protected getFunctionPath(): string {
    return path.join(
      __dirname,
      '../../src',
      this.directoryName,
      this.functionSourceCodeFile
    );
  }
}
