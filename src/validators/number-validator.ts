import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface INumberValidatorOptions extends IBaseValidatorOptions {
    tooSmall?: string;
    tooBig?: string;
    integerOnly?: boolean;
    min?: number;
    max?: number;
}

export class NumberValidator extends BaseValidator {
    integerMessage: string = '{attribute} must be an integer.';
    numberMessage: string = '{attribute} must be a number.';
    tooSmall: string = '{attribute} must be no less than {min}.';
    tooBig: string = '{attribute} must be no greater than {max}.';
    integerOnly: boolean = false;
    min: number;
    max: number;

    constructor(attributeLabel: string, value: any, options?: INumberValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (!this.message) {
            this.message = this.integerOnly ? this.integerMessage : this.numberMessage;
        }
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['tooSmall', 'tooBig', 'integerOnly', 'min', 'max']);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        if (!_.isNumber(this.value) || (this.integerOnly && !this.isInteger(this.value))) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        if (this.min && this.value < this.min) {
            return this.tooSmall.replace('{attribute}', this.attributeLabel).replace('{min}', this.min.toString());
        }

        if (this.max && this.value > this.max) {
            return this.tooBig.replace('{attribute}', this.attributeLabel).replace('{max}', this.max.toString());
        }

        return false;
    }

    isInteger(value: number) {
        return _.isNumber(value) && value % 1 === 0;
    }
}
