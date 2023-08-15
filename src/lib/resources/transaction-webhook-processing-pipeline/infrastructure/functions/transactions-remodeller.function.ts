import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack } from 'aws-cdk-lib';

export class TransactionsRemodellerFunction {
  private static readonly FUNCTION_NAME = 'TransactionsRemodellerFunction';
  private static readonly NODE_RUNTIME = Runtime.NODEJS_18_X;
  private static readonly FUNCTION_CODE_FILE = 'transaction-remodeller.lambda';
  private static readonly HANDLER = `${TransactionsRemodellerFunction.FUNCTION_CODE_FILE}.handler`;

  public static create(stack: Stack): Function {
    return new Function(stack, TransactionsRemodellerFunction.FUNCTION_NAME, {
      runtime: TransactionsRemodellerFunction.NODE_RUNTIME,
      handler: TransactionsRemodellerFunction.HANDLER,
      code: Code.fromAsset(
        `../../src/${TransactionsRemodellerFunction.FUNCTION_CODE_FILE}`
      ),
    });
  }
}