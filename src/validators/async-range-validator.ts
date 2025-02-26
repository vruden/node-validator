import * as _ from 'lodash';
import { BaseRangeValidator } from './base-range-validator';

export class AsyncRangeValidator extends BaseRangeValidator {
    async validate(): Promise<string | boolean> {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        let range = this.range;

        if (_.isFunction(this.range)) {
            range = await this.range(this.value);

            if (!_.isArray(range)) {
                throw new Error('The `range` property is not array.');
            }
        }

        let result = false;

        if (this.strict) {
            result = _.indexOf(range, this.value) !== -1;
        } else {
            for (const i of range) {
                // eslint-disable-next-line eqeqeq
                if (this.value == i) {
                    result = true;
                    break;
                }
            }
        }

        result = this.not ? !result : result;

        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel).replace('{range}', range.join(', '));
        }

        return false;
    }
}
