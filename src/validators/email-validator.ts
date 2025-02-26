import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export class EmailValidator extends BaseValidator {
    pattern =
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    message: string = '{attribute} is not a valid email address.';

    constructor(attributeLabel: string, value: any, options?: IBaseValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, []);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        if (!_.isString(this.value) || this.value.length > 320 || !this.pattern.test(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}
