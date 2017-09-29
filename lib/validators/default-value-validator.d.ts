import { AbstractValidator } from './abstract-validator';
export declare class DefaultValueValidator extends AbstractValidator {
    static validate(value: any, defaultValue: any): any;
    static isEmpty(value: any): boolean;
}
