import { Stack } from 'aws-cdk-lib';
import { AssetCode, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from "path";

export class BaseWrapperFunction {
  protected static FUNCTION_NAME = 'BaseWrapperFunction';
  protected static NODE_RUNTIME = Runtime.NODEJS_18_X;
  protected static FUNCTION_CODE_FILE = 'base-wrapper.lambda';
  protected static HANDLER = `${this.FUNCTION_CODE_FILE}.handler`;

  protected static getFunctionPath(): AssetCode
  {
    return AssetCode.fromAsset(
      path.join(__dirname, '../../src', this.FUNCTION_CODE_FILE)
    );
  }

  public static create(stack: Stack): Function {
    return new Function(stack, this.FUNCTION_NAME, {
      runtime: this.NODE_RUNTIME,
      handler: this.HANDLER,
      code: this.getFunctionPath(),
    });
  }
}
