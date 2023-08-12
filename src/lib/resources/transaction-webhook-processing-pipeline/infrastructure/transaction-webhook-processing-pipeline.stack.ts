import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {TransactionProcessingMachineBuilder} from "./transaction-processing.machine";

export class TransactionWebhookProcessingPipelineStack extends Stack {
  static readonly STACK_NAME = 'TransactionWebhookProcessingPipelineStack';

  constructor(scope: Construct, props?: StackProps) {
    super(scope, TransactionWebhookProcessingPipelineStack.STACK_NAME, props);

    /**
     * Build the state machine that processes the transactions.
     */
    const stateMachineBuilder = new TransactionProcessingMachineBuilder();
    stateMachineBuilder.build(this);
  }
}
