import { Stack } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export abstract class BaseWrapperFunction {
  protected nodeRuntime = Runtime.NODEJS_18_X;

  protected abstract lambdaName: string;
  protected abstract functionSourceCodeFile: string;

  protected abstract getFunctionPath(): string;

  public create(stack: Stack): NodejsFunction {
    return new NodejsFunction(stack, this.lambdaName, {
      runtime: this.nodeRuntime,
      handler: `handler`,
      entry: this.getFunctionPath(),
    });
  }
}
