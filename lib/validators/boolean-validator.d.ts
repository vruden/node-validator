import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface IBooleanValidatorOptions extends IBaseValidatorOptions {
    strict: boolean;
}
export declare class BooleanValidator extends BaseValidator {
    message: string;
    strict: boolean;
    constructor(attributeLabel: string, value: any, options?: IBooleanValidatorOptions);
    protected getOptionNameList(...childrenList: string[][]): string[];
    validate(): string | boolean;
}
