export type LambdaProps = {
    name: string;
    functionSourcePath: string;
    permissions?: string[];
    handler?: string;
};