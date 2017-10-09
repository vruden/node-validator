"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class RequiredValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} cannot be blank.';
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, []);
    }
    validate() {
        if (_.isUndefined(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.RequiredValidator = RequiredValidator;
