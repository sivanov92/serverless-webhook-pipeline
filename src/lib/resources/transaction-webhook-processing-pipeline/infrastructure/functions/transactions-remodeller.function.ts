import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

export class TransactionsRemodellerFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionsRemodellerFunction';
  protected readonly functionSourceCodeFile =
    'transaction-remodeller.lambda.ts';
  protected readonly directoryName = 'transaction-remodeller';

  protected getFunctionPath(): string {
    return path.join(
      __dirname,
      '../../src',
      this.directoryName,
      this.functionSourceCodeFile
    );
  }

  protected getRole(stack: Stack): Role | null {
    const role = new Role(stack, 'StoreRemodelledTransactions', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ['dynamodb:BatchWriteItem'],
        resources: ['*'],
      })
    );
    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    return role;
  }
}
