import { BaseWrapperFunction } from '../../../../common';
import * as path from 'path';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

export class TransactionsRawStorageFunction extends BaseWrapperFunction {
  protected readonly lambdaName = 'TransactionsRawStorageFunction';
  protected readonly functionSourceCodeFile =
    'transaction-raw-storage.lambda.ts';
  protected readonly directoryName = 'transaction-raw-storage';

  protected getFunctionPath(): string {
    return path.join(
      __dirname,
      '../../src',
      this.directoryName,
      this.functionSourceCodeFile
    );
  }

  protected getRole(stack: Stack): Role | null {
    const role = new Role(stack, 'StoreRawTransactions', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:PutObject'],
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
