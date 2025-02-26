"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeValidator = void 0;
const _ = require("lodash");
const base_range_validator_1 = require("./base-range-validator");
class RangeValidator extends base_range_validator_1.BaseRangeValidator {
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let range = this.range;
        if (_.isFunction(this.range)) {
            range = this.range(this.value);
            if (!_.isArray(range)) {
                throw new Error('The `range` property is not array.');
            }
        }
        let result = false;
        if (this.strict) {
            result = _.indexOf(range, this.value) !== -1;
        }
        else {
            for (const i of range) {
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
exports.RangeValidator = RangeValidator;
