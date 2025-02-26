import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export class RequiredValidator extends BaseValidator {
    message: string = '{attribute} cannot be blank.';
    strict: boolean = false;

    constructor(attributeLabel: string, value: any, options?: IBaseValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['strict']);
    }

    validate(): string | boolean {
        if (
            (this.strict && _.isUndefined(this.value)) ||
            (!this.strict &&
                (this.constructor as typeof BaseValidator).isEmptyValue(
                    _.isString(this.value) ? _.trim(this.value) : this.value
                ))
        ) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}
