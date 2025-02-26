import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IBaseRangeValidatorOptions extends IBaseValidatorOptions {
    range: any;
    strict: boolean;
    not: boolean;
}

export class BaseRangeValidator extends BaseValidator {
    message: string = '{attribute} is invalid.';
    range: any[];
    strict: boolean = false;
    not: boolean = false;

    constructor(attributeLabel: string, value: any, options?: IBaseRangeValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (!((_.isArray(this.range) && !_.isEmpty(this.range)) || _.isFunction(this.range))) {
            throw new Error('The `range` property must be set.');
        }
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['range', 'strict', 'not']);
    }
}
