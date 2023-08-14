#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TransactionWebhookProcessingPipelineStack } from '../lib/resources';

const app = new cdk.App();

new TransactionWebhookProcessingPipelineStack(app);
