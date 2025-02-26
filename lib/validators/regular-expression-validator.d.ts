import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface IRegularExpressionValidatorOptions extends IBaseValidatorOptions {
    pattern: RegExp;
    not: boolean;
}
export declare class RegularExpressionValidator extends BaseValidator {
    message: string;
    pattern: never;
    not: boolean;
    constructor(attributeLabel: string, value: any, options?: IRegularExpressionValidatorOptions);
    protected getOptionNameList(...childrenList: string[][]): string[];
    validate(): string | boolean;
}
