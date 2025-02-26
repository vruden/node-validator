import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IStringValidatorOprions extends IBaseValidatorOptions {
    tooShort?: string;
    tooLong?: string;
    notEqual?: string;
    length?: number | number[];
    min?: number;
    max?: number;
}

export class StringValidator extends BaseValidator {
    message: string = '{attribute} must be a string.';
    tooShort: string = '{attribute} should contain at least {min} characters.';
    tooLong: string = '{attribute} should contain at most {max} characters.';
    notEqual: string = '{attribute} should contain {length} characters.';
    length?: number;
    min?: number;
    max?: number;

    constructor(attributeLabel: string, value: any, options?: IStringValidatorOprions) {
        super(attributeLabel, value, options);

        // console.log('sttttriiing', options.length)
        this.setOptions(options);

        // console.log(options.length)

        if (_.isArray(this.length)) {
            if (this.length[0]) {
                this.min = this.length[0];
            }

            if (this.length[1]) {
                this.max = this.length[1];
            }

            this.length = undefined;
        }

        // console.log(this.length)
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['tooShort', 'tooLong', 'notEqual', 'length', 'min', 'max']);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        if (!_.isString(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        const length = this.value.length;

        if (this.length && this.length !== length) {
            return this.notEqual
                .replace('{attribute}', this.attributeLabel)
                .replace('{length}', this.length.toString());
        }

        if (this.min && this.min > length) {
            return this.tooShort.replace('{attribute}', this.attributeLabel).replace('{min}', this.min.toString());
        }

        if (this.max && this.max < length) {
            return this.tooLong.replace('{attribute}', this.attributeLabel).replace('{max}', this.max.toString());
        }

        return false;
    }
}
