import { Stack } from 'aws-cdk-lib';
import { AssetCode, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

export abstract class BaseWrapperFunction {
  protected nodeRuntime = Runtime.NODEJS_18_X;

  protected abstract lambdaName: string;
  protected abstract functionSourceCodeFile: string;

  protected abstract getFunctionPath(): AssetCode;

  public create(stack: Stack): Function {
    return new Function(stack, this.lambdaName, {
      runtime: this.nodeRuntime,
      handler: `${this.functionSourceCodeFile}.handler`,
      code: this.getFunctionPath(),
    });
  }
}
