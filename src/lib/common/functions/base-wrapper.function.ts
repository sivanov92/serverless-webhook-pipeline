import { Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

export class BaseWrapperFunction {
  protected static FUNCTION_NAME = 'BaseWrapperFunction';
  protected static NODE_RUNTIME = Runtime.NODEJS_18_X;
  protected static FUNCTION_CODE_FILE = 'base-wrapper.lambda';
  protected static HANDLER = `${this.FUNCTION_CODE_FILE}.handler`;

  public static create(stack: Stack): Function {
    return new Function(stack, this.FUNCTION_NAME, {
      runtime: this.NODE_RUNTIME,
      handler: this.HANDLER,
      code: Code.fromAsset(`../../src/${this.FUNCTION_CODE_FILE}`),
    });
  }
}
