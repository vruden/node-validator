"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultValueValidator = void 0;
const _ = require("lodash");
const abstract_validator_1 = require("./abstract-validator");
class DefaultValueValidator extends abstract_validator_1.AbstractValidator {
    static validate(value, defaultValue) {
        if (this.isEmpty(value)) {
            return _.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }
        return value;
    }
    static isEmpty(value) {
        return _.isNil(value) || value === '' || ((_.isArray(value) || _.isPlainObject(value)) && _.isEmpty(value));
    }
}
exports.DefaultValueValidator = DefaultValueValidator;
