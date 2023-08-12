import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack } from 'aws-cdk-lib';

export class TransactionValidatorFunction {
  private static readonly FUNCTION_NAME = 'TransactionValidatorFunction';
  private static readonly NODE_RUNTIME = Runtime.NODEJS_18_X;
  private static readonly FUNCTION_CODE_FILE = 'transaction-validator.lambda';
  private static readonly HANDLER = `${TransactionValidatorFunction.FUNCTION_CODE_FILE}.handler`;

  public static create(stack: Stack): Function {
    return new Function(stack, TransactionValidatorFunction.FUNCTION_NAME, {
      runtime: TransactionValidatorFunction.NODE_RUNTIME,
      handler: TransactionValidatorFunction.HANDLER,
      code: Code.fromAsset(
        `../src/${TransactionValidatorFunction.FUNCTION_CODE_FILE}`
      ),
    });
  }
}
