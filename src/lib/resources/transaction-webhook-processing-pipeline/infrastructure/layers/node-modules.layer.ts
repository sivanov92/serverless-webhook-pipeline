import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack } from 'aws-cdk-lib';
import * as path from 'path';

export class NodeModulesLayer {
  private static layers: LayerVersion[] = [];

  public static getLayer(stack: Stack): LayerVersion[] {
    if(!this.layers.length) {
      const layer = new LayerVersion(stack, 'nodeModulesLayer', {
        code: Code.fromAsset(
            path.join(__dirname, '../../../../../../', 'node_modules/ajv')
        ),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        description: 'Node modules layer',
      });
      this.layers.push(layer);
    }

    return this.layers;
  }
}