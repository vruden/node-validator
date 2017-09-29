"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const abstract_validator_1 = require("./abstract-validator");
class FilterValidator extends abstract_validator_1.AbstractValidator {
    static validate(filter, value) {
        if (!_.isFunction(filter)) {
            throw new Error('The `filter` property must be set.');
        }
        if (_.isNil(value)) {
            return value;
        }
        return filter(value);
    }
}
exports.FilterValidator = FilterValidator;
//# sourceMappingURL=filter-validator.js.map