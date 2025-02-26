import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface INumberValidatorOptions extends IBaseValidatorOptions {
    tooSmall?: string;
    tooBig?: string;
    integerOnly?: boolean;
    min?: number;
    max?: number;
}
export declare class NumberValidator extends BaseValidator {
    integerMessage: string;
    numberMessage: string;
    tooSmall: string;
    tooBig: string;
    integerOnly: boolean;
    min: number;
    max: number;
    constructor(attributeLabel: string, value: any, options?: INumberValidatorOptions);
    protected getOptionNameList(...childrenList: string[][]): string[];
    validate(): string | boolean;
    isInteger(value: number): boolean;
}
