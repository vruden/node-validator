"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class RegularExpressionValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} is invalid.';
        this.not = false;
        this.setOptions(options);
        if (_.isNil(this.pattern) || !_.isRegExp(this.pattern)) {
            throw new Error('The `pattern` property must be set.');
        }
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['pattern', 'not']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let result = this.pattern.test(this.value);
        if (this.not) {
            result = !result;
        }
        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.RegularExpressionValidator = RegularExpressionValidator;
//# sourceMappingURL=regular-expression-validator.js.map