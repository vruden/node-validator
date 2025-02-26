import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IBaseCompareValidatorOptions extends IBaseValidatorOptions {
    compareValue: any;
    operator: string;
}

export class BaseCompareValidator extends BaseValidator {
    message: string = '{attribute} is invalid.';
    compareValue: any;
    operator: string = '==';

    constructor(attributeLabel: string, value: any, options?: IBaseCompareValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (_.isUndefined(options?.compareValue)) {
            throw new Error('The `compareValue` property must be set.');
        }
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['compareValue', 'operator']);
    }

    copmare(compareValue: any) {
        const operator = this.operator;
        const value = this.value;

        let result = false;

        // eslint-disable-next-line
        switch (operator) {
            case '==':
                // eslint-disable-next-line eqeqeq
                result = compareValue == value;
                break;
            case '===':
                result = compareValue === value;
                break;
            case '!=':
                // eslint-disable-next-line eqeqeq
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
