"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class RequiredValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} cannot be blank.';
        this.strict = false;
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['strict']);
    }
    validate() {
        if ((this.strict && _.isUndefined(this.value)) || (!this.strict && this.constructor.isEmptyValue(_.isString(this.value) ? _.trim(this.value) : this.value))) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.RequiredValidator = RequiredValidator;
