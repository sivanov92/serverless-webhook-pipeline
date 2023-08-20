import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { BaseWrapperFunction } from '../../../../common';

export class TransactionValidatorFunction extends BaseWrapperFunction {
  protected static readonly FUNCTION_NAME = 'TransactionValidatorFunction';
  protected static readonly NODE_RUNTIME = Runtime.NODEJS_18_X;
  protected static readonly FUNCTION_CODE_FILE = 'transaction-validator.lambda';
  protected static readonly HANDLER = `${this.FUNCTION_CODE_FILE}.handler`;
}
