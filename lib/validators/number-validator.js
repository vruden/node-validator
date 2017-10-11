"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class NumberValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.integerMessage = '{attribute} must be an integer.';
        this.numberMessage = '{attribute} must be a number.';
        this.tooSmall = '{attribute} must be no less than {min}.';
        this.tooBig = '{attribute} must be no greater than {max}.';
        this.integerOnly = false;
        this.setOptions(options);
        if (!this.message) {
            this.message = this.integerOnly ? this.integerMessage : this.numberMessage;
        }
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['tooSmall', 'tooBig', 'integerOnly', 'min', 'max']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        if (!_.isNumber(this.value) || (this.integerOnly && !this.isInteger(this.value))) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        if (this.min && this.value < this.min) {
            return this.tooSmall.replace('{attribute}', this.attributeLabel).replace('{min}', this.min.toString());
        }
        if (this.max && this.value > this.max) {
            return this.tooBig.replace('{attribute}', this.attributeLabel).replace('{max}', this.max.toString());
        }
        return false;
    }
    isInteger(value) {
        return _.isNumber(value) && value % 1 === 0;
    }
}
exports.NumberValidator = NumberValidator;
