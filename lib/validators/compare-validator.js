"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_compare_validator_1 = require("./base-compare-validator");
class CompareValidator extends base_compare_validator_1.BaseCompareValidator {
    validate() {
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
exports.CompareValidator = CompareValidator;
