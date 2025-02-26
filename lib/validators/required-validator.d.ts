import { BaseValidator, IBaseValidatorOptions } from './base-validator';
export declare class RequiredValidator extends BaseValidator {
    message: string;
    strict: boolean;
    constructor(attributeLabel: string, value: any, options?: IBaseValidatorOptions);
    protected getOptionNameList(...childrenList: any[]): string[];
    validate(): string | boolean;
}
