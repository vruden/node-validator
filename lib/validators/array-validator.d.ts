import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export interface IArrayValidatorOptions extends IBaseValidatorOptions {
    emptyMessage: string;
    typeMessage: string;
    notEmpty: boolean;
    type: string;
}
export declare class ArrayValidator extends BaseValidator {
    message: string;
    emptyMessage: string;
    typeMessage: string;
    notEmpty: boolean;
    type: string;
    constructor(attributeLabel: string, value: any, options?: IArrayValidatorOptions);
    protected getOptionNameList(...childrenList: string[][]): string[];
    validate(): string | boolean;
    isInteger(value: any): boolean;
    isId(value: any): boolean;
}
