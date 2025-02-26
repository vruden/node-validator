import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface IRegularExpressionValidatorOptions extends IBaseValidatorOptions {
    pattern: any;
    not: boolean;
}
export declare class RegularExpressionValidator extends BaseValidator {
    message: string;
    pattern: any;
    not: boolean;
    constructor(attributeLabel: string, value: any, options?: IRegularExpressionValidatorOptions);
    protected getOptionNameList(...childrenList: any[]): string[];
    validate(): string | boolean;
}
