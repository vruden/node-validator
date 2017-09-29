import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IRangeValidatorOptions extends IBaseValidatorOptions {
    range;
    strict: boolean;
    not: boolean;
}

export class RangeValidator extends BaseValidator {
    message: string = '{attribute} is invalid.';
    range: any[];
    strict: boolean = false;
    not: boolean = false;

    constructor(attributeLabel: string, value, options?: IRangeValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (!_.isArray(this.range) || _.isEmpty(this.range)) {
            throw new Error('The `range` property must be set.');
        }
    }

    protected getOptionNameList(...childrenList): string[] {
        return super.getOptionNameList(...childrenList, ['range', 'strict', 'not']);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        let result = false;

        if (this.strict) {
            result = _.indexOf(this.range, this.value) !== -1;
        } else {
            for (const i of this.range) {
                if (this.value == i) {
                    result = true;
                    break;
                }
            }
        }

        result = this.not ? !result : result;

        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}