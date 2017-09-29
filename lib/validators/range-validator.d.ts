import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface IRangeValidatorOptions extends IBaseValidatorOptions {
    range: any;
    strict: boolean;
    not: boolean;
}
export declare class RangeValidator extends BaseValidator {
    message: string;
    range: any[];
    strict: boolean;
    not: boolean;
    constructor(attributeLabel: string, value: any, options?: IRangeValidatorOptions);
    protected getOptionNameList(...childrenList: any[]): string[];
    validate(): string | boolean;
}
