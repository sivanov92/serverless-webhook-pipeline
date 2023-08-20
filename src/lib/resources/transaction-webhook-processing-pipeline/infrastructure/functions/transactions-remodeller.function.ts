import { AssetCode, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';

export class TransactionsRemodellerFunction extends BaseWrapperFunction {
  protected static readonly FUNCTION_NAME = 'TransactionsRemodellerFunction';
  protected static readonly NODE_RUNTIME = Runtime.NODEJS_18_X;
  protected static readonly FUNCTION_CODE_FILE =
    'transaction-remodeller.lambda';
  protected static readonly HANDLER = `${this.FUNCTION_CODE_FILE}.handler`;
  protected static readonly DIRECTORY_NAME = 'transaction-remodeller';

  protected static getFunctionPath(): AssetCode {
    return Code.fromAsset(
      path.join(__dirname, '../../src', this.DIRECTORY_NAME)
    );
  }
}
