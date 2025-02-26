import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IRegularExpressionValidatorOptions extends IBaseValidatorOptions {
    pattern: RegExp;
    not: boolean;
}

export class RegularExpressionValidator extends BaseValidator {
    message: string = '{attribute} is invalid.';
    pattern;
    not: boolean = false;

    constructor(attributeLabel: string, value: any, options?: IRegularExpressionValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);

        if (_.isNil(this.pattern) || !_.isRegExp(this.pattern)) {
            throw new Error('The `pattern` property must be set.');
        }
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['pattern', 'not']);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        let result = (<any>this.pattern).test(this.value);

        if (this.not) {
            result = !result;
        }

        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}
