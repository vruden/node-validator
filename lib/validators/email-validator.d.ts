import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export declare class EmailValidator extends BaseValidator {
    pattern: RegExp;
    message: string;
    constructor(attributeLabel: string, value: any, options?: IBaseValidatorOptions);
    protected getOptionNameList(...childrenList: any[]): string[];
    validate(): string | boolean;
}
