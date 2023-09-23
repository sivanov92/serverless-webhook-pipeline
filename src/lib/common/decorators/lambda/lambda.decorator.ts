import { LambdaProps } from './lambda-props.type';
import 'reflect-metadata';
import {
    lambdaFunctionSourcePathMetaKey,
    lambdaHandlerMetaKey,
    lambdaNameMetaKey,
    lambdaPermissionsMetaKey
} from "./lambda.metakey";

export namespace LambdaDecorators {
    export function Lambda(lambdaProps: LambdaProps) {
        return function (target: any) {
            Reflect.defineMetadata(lambdaNameMetaKey, lambdaProps.name, target);
            Reflect.defineMetadata(lambdaFunctionSourcePathMetaKey, lambdaProps.functionSourcePath, target);

            if(lambdaProps?.permissions?.length) {
                Reflect.defineMetadata(lambdaPermissionsMetaKey, lambdaProps.permissions, target);
            }

            if(lambdaProps?.handler) {
                Reflect.defineMetadata(lambdaHandlerMetaKey, lambdaProps.handler, target);
            }
        };
    }
}