import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack } from 'aws-cdk-lib';
import {BaseWrapperFunction} from "../../../../common";

export class TransactionsRemodellerFunction extends BaseWrapperFunction {
  protected static readonly FUNCTION_NAME = 'TransactionsRemodellerFunction';
  protected static readonly NODE_RUNTIME = Runtime.NODEJS_18_X;
  protected static readonly FUNCTION_CODE_FILE = 'transaction-remodeller.lambda';
  protected static readonly HANDLER = `${this.FUNCTION_CODE_FILE}.handler`;
}