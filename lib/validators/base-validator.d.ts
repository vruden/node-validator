import { AbstractValidator } from './abstract-validator';
export interface IBaseValidatorOptions {
    message?: string;
    skipOnEmpty?: boolean;
}
export interface IBaseValidator {
    validate(): boolean | string;
}
export declare class BaseValidator extends AbstractValidator implements IBaseValidator {
    protected attributeLabel: string;
    protected value: any;
    message: string;
    skipOnEmpty: boolean;
    constructor(attributeLabel: string, value: any, options?: IBaseValidatorOptions);
    protected getOptionNameList(...childrenList: string[][]): string[];
    protected setOptions(options: any): void;
    isAvailableForValidation(): boolean;
    validate(): boolean | string;
    static isEmptyValue(value: any): boolean;
    static validateValue(value: any, variableName?: any, options?: any): boolean | string;
}
