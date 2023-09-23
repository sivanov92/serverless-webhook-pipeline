import { Stack } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import {
  lambdaFunctionSourcePathMetaKey,
  lambdaHandlerMetaKey,
  lambdaNameMetaKey,
  lambdaPermissionsMetaKey,
} from '../../common/decorators/lambda';

export class BaseLambdaFunction {
  protected readonly nodeRuntime = Runtime.NODEJS_18_X;

  public create(stack: Stack): NodejsFunction {
    return new NodejsFunction(stack, this.getLambdaName(), {
      runtime: this.nodeRuntime,
      handler: this.getHandlerMethod(),
      entry: this.getFunctionPath(),
      role: this.getRole(stack),
    });
  }

  /**
   * Get the lambda name from the metadata
   *
   * @private
   */
  private getLambdaName(): string {
    if (Reflect.hasMetadata(lambdaNameMetaKey, this.constructor)) {
      return Reflect.getMetadata(lambdaNameMetaKey, this.constructor);
    }

    throw new Error(`Lambda name not found for ${this.constructor.name}`);
  }

  /**
   * Get the lambda function path from the metadata
   *
   * @private
   */
  private getFunctionPath(): string {
    if (
      Reflect.hasMetadata(lambdaFunctionSourcePathMetaKey, this.constructor)
    ) {
      return Reflect.getMetadata(
        lambdaFunctionSourcePathMetaKey,
        this.constructor
      );
    }

    throw new Error('Lambda function source path not found.');
  }

  /**
   * Get the lambda handler method from the metadata, if not found, use the default handler method
   *
   * @private
   */
  private getHandlerMethod(): string {
    if (Reflect.hasMetadata(lambdaHandlerMetaKey, this.constructor)) {
      return Reflect.getMetadata(lambdaHandlerMetaKey, this.constructor);
    }

    return 'handler';
  }

  /**
   * Create the lambda role with the basic execution role and the permissions defined in the metadata
   *
   * @param stack
   * @private
   */
  private getRole(stack: Stack): Role {
    const lambdaName = this.getLambdaName();
    const role = new Role(stack, lambdaName + '_ExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    if (Reflect.hasMetadata(lambdaPermissionsMetaKey, this.constructor)) {
      const permissions = Reflect.getMetadata(
        lambdaPermissionsMetaKey,
        this.constructor
      ) as string[];
      if (permissions.length) {
        role.addToPolicy(
          new PolicyStatement({
            actions: permissions,
            resources: ['*'],
          })
        );
      }
    }

    return role;
  }
}
