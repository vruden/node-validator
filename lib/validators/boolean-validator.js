"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = require("./base-validator");
class BooleanValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} is not boolean.';
        this.strict = false;
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['strict']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let result = false;
        if (this.strict) {
            result = this.value === true || this.value === false;
        }
        else {
            result = this.value == true || this.value == false;
        }
        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.BooleanValidator = BooleanValidator;
