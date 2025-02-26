import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface IStringValidatorOprions extends IBaseValidatorOptions {
    tooShort?: string;
    tooLong?: string;
    notEqual?: string;
    length?: number | number[];
    min?: number;
    max?: number;
}
export declare class StringValidator extends BaseValidator {
    message: string;
    tooShort: string;
    tooLong: string;
    notEqual: string;
    length?: number;
    min?: number;
    max?: number;
    constructor(attributeLabel: string, value: any, options?: IStringValidatorOprions);
    protected getOptionNameList(...childrenList: string[][]): string[];
    validate(): string | boolean;
}
