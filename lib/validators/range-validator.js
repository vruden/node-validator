"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class RangeValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} is invalid.';
        this.strict = false;
        this.not = false;
        this.setOptions(options);
        if (!_.isArray(this.range) || _.isEmpty(this.range)) {
            throw new Error('The `range` property must be set.');
        }
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['range', 'strict', 'not']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let result = false;
        if (this.strict) {
            result = _.indexOf(this.range, this.value) !== -1;
        }
        else {
            for (const i of this.range) {
                if (this.value == i) {
                    result = true;
                    break;
                }
            }
        }
        result = this.not ? !result : result;
        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.RangeValidator = RangeValidator;
//# sourceMappingURL=range-validator.js.map