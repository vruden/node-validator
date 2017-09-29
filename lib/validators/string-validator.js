"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class StringValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} must be a string.';
        this.tooShort = '{attribute} should contain at least {min} characters.';
        this.tooLong = '{attribute} should contain at most {max} characters.';
        this.notEqual = '{attribute} should contain {length} characters.';
        // console.log('sttttriiing', options.length)
        // this.setOptions(options);
        // console.log(options.length)
        if (_.isArray(this.length)) {
            if (length[0]) {
                this.min = this.length[0];
            }
            if (this.length[1]) {
                this.max = this.length[1];
            }
            this.length = undefined;
        }
        // console.log(this.length)
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['tooShort', 'tooLong', 'notEqual', 'length', 'min', 'max']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        if (!_.isString(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        const length = this.value.length;
        if (this.length && this.length !== length) {
            return this.notEqual.replace('{attribute}', this.attributeLabel).replace('{length}', this.length.toString());
        }
        else {
            if (this.min && this.min > length) {
                return this.tooShort.replace('{attribute}', this.attributeLabel).replace('{min}', this.min.toString());
            }
            if (this.max && this.max < length) {
                return this.tooLong.replace('{attribute}', this.attributeLabel).replace('{max}', this.max.toString());
            }
        }
        return false;
    }
}
exports.StringValidator = StringValidator;
//# sourceMappingURL=string-validator.js.map