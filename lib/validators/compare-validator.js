"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class CompareValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} is invalid.';
        this.operator = '==';
        this.setOptions(options);
        if (_.isUndefined(options.compareValue)) {
            throw new Error('The `compareValue` property must be set.');
        }
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['compareValue', 'operator']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        const compareValue = this.compareValue;
        const operator = this.operator;
        const value = this.value;
        let result = false;
        switch (operator) {
            case '==':
                result = compareValue == value;
                break;
            case '===':
                result = compareValue === value;
                break;
            case '!=':
                result = compareValue != value;
                break;
            case '!==':
                result = compareValue !== value;
                break;
            case '>':
                result = compareValue > value;
                break;
            case '>=':
                result = compareValue >= value;
                break;
            case '<':
                result = compareValue < value;
                break;
            case '<=':
                result = compareValue <= value;
                break;
        }
        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.CompareValidator = CompareValidator;
