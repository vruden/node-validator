import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface ICompareValidatorOptions extends IBaseValidatorOptions {
    compareValue: any;
    operator: string;
}
export declare class CompareValidator extends BaseValidator {
    message: string;
    compareValue: any;
    operator: string;
    constructor(attributeLabel: string, value: any, options?: ICompareValidatorOptions);
    protected getOptionNameList(...childrenList: any[]): string[];
    validate(): string | boolean;
}
