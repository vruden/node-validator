import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IBaseCompareValidatorOptions extends IBaseValidatorOptions {
    compareValue;
    operator: string;
}

export class BaseCompareValidator extends BaseValidator {
    message: string = '{attribute} is invalid.';
    compareValue;
    operator: string = '==';

    constructor(attributeLabel: string, value, options?: IBaseCompareValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (_.isUndefined(options.compareValue)) {
            throw new Error('The `compareValue` property must be set.');
        }
    }

    protected getOptionNameList(...childrenList): string[] {
        return super.getOptionNameList(...childrenList, ['compareValue', 'operator']);
    }

    copmare(compareValue) {
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

        return result;
    }
}