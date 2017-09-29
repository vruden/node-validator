import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface ICompareValidatorOptions extends IBaseValidatorOptions {
    compareValue;
    operator: string;
}

export class CompareValidator extends BaseValidator {
    message: string = '{attribute} is invalid.';
    compareValue;
    operator: string = '==';

    constructor(attributeLabel: string, value, options?: ICompareValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (_.isUndefined(options.compareValue)) {
            throw new Error('The `compareValue` property must be set.');
        }
    }

    protected getOptionNameList(...childrenList): string[] {
        return super.getOptionNameList(...childrenList, ['compareValue', 'operator']);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        const compareValue = this.compareValue;
        const operator =  this.operator;
        const value = this.value;

        let result = false;

        switch (operator) {
            case '==':
                result = compareValue == value;
                break;
            case '===':
                result = compareValue === value;
                break;
            case '!=':
                result = compareValue != value;
                break;
            case '!==':
                result = compareValue !== value;
                break;
            case '>':
                result = compareValue > value;
                break;
            case '>=':
                result = compareValue >= value;
                break;
            case '<':
                result = compareValue < value;
                break;
            case '<=':
                result = compareValue <= value;
                break;
        }

        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}