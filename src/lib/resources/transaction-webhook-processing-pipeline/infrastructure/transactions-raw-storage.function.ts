import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {Stack} from "aws-cdk-lib";

export class TransactionsRawStorageFunction {
    private static readonly FUNCTION_NAME = 'TransactionsRawStorageFunction';
    private static readonly NODE_RUNTIME = Runtime.NODEJS_18_X;
    private static readonly FUNCTION_CODE_FILE = 'transaction-raw-storage.lambda';
    private static readonly HANDLER = `${TransactionsRawStorageFunction.FUNCTION_CODE_FILE}.handler`;

    public static create(stack: Stack): Function {
        return new Function(stack, TransactionsRawStorageFunction.FUNCTION_NAME, {
            runtime: TransactionsRawStorageFunction.NODE_RUNTIME,
            handler: TransactionsRawStorageFunction.HANDLER,
            code: Code.fromAsset(
                `../src/${TransactionsRawStorageFunction.FUNCTION_CODE_FILE}`
            ),
        });
    }
}