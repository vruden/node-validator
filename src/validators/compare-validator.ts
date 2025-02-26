import * as _ from 'lodash';
import { BaseCompareValidator } from './base-compare-validator';

export class CompareValidator extends BaseCompareValidator {
    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        let compareValue = this.compareValue;

        if (_.isFunction(this.compareValue)) {
            compareValue = this.compareValue();
        }

        if (!this.copmare(compareValue)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}
