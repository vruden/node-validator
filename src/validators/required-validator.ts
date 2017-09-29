import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export class RequiredValidator extends BaseValidator {
    message: string = '{attribute} cannot be blank.';

    constructor(attributeLabel: string, value, options?: IBaseValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);
    }

    protected getOptionNameList(...childrenList): string[] {
        return super.getOptionNameList(...childrenList, []);
    }

    validate(): string | boolean {
        if (_.isUndefined(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}