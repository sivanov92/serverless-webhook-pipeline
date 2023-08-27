import { Stack } from 'aws-cdk-lib';
import {AssetCode, Function, LayerVersion, Runtime} from 'aws-cdk-lib/aws-lambda';
import {
  NodeModulesLayer,
} from "../../resources/transaction-webhook-processing-pipeline/infrastructure/layers/node-modules.layer";

export abstract class BaseWrapperFunction {
  protected nodeRuntime = Runtime.NODEJS_18_X;

  protected abstract lambdaName: string;
  protected abstract functionSourceCodeFile: string;

  protected abstract getFunctionPath(): AssetCode;
  protected getLayers(stack: Stack): LayerVersion[] {
    return NodeModulesLayer.getLayer(stack);
  }

  public create(stack: Stack): Function {
    return new Function(stack, this.lambdaName, {
      runtime: this.nodeRuntime,
      handler: `${this.functionSourceCodeFile}.handler`,
      code: this.getFunctionPath(),
      layers: this.getLayers(stack),
    });
  }
}
