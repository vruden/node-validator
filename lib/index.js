"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = exports.checkInteger = exports.checkString = exports.match = exports.asyncCheckInRange = exports.checkInRange = exports.checkEmail = exports.checkNumber = exports.asyncCompare = exports.compare = exports.checkBoolean = exports.checkArray = exports.checkRequiredValue = exports.asyncSetDefaultValue = exports.setDefaultValue = exports.asyncFilter = exports.filter = exports.asyncValidate = exports.validate = void 0;
const _ = require("lodash");
const filter_validator_1 = require("./validators/filter-validator");
const async_filter_validator_1 = require("./validators/async-filter-validator");
const default_value_validator_1 = require("./validators/default-value-validator");
const async_default_value_validator_1 = require("./validators/async-default-value-validator");
const required_validator_1 = require("./validators/required-validator");
const array_validator_1 = require("./validators/array-validator");
const boolean_validator_1 = require("./validators/boolean-validator");
const compare_validator_1 = require("./validators/compare-validator");
const async_compare_validator_1 = require("./validators/async-compare-validator");
const number_validator_1 = require("./validators/number-validator");
const email_validator_1 = require("./validators/email-validator");
const range_validator_1 = require("./validators/range-validator");
const async_range_validator_1 = require("./validators/async-range-validator");
const regular_expression_validator_1 = require("./validators/regular-expression-validator");
const string_validator_1 = require("./validators/string-validator");
var validator_1 = require("./validator");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validator_1.validate; } });
var async_validator_1 = require("./async-validator");
Object.defineProperty(exports, "asyncValidate", { enumerable: true, get: function () { return async_validator_1.validate; } });
exports.filter = filter_validator_1.FilterValidator.validate;
exports.asyncFilter = async_filter_validator_1.AsyncFilterValidator.validate;
exports.setDefaultValue = default_value_validator_1.DefaultValueValidator.validate;
exports.asyncSetDefaultValue = async_default_value_validator_1.AsyncDefaultValueValidator.validate;
exports.checkRequiredValue = required_validator_1.RequiredValidator.validateValue;
exports.checkArray = array_validator_1.ArrayValidator.validateValue;
exports.checkBoolean = boolean_validator_1.BooleanValidator.validateValue;
exports.compare = compare_validator_1.CompareValidator.validateValue;
exports.asyncCompare = async_compare_validator_1.AsyncCompareValidator.validateValue;
exports.checkNumber = number_validator_1.NumberValidator.validateValue;
exports.checkEmail = email_validator_1.EmailValidator.validateValue;
exports.checkInRange = range_validator_1.RangeValidator.validateValue;
exports.asyncCheckInRange = async_range_validator_1.AsyncRangeValidator.validateValue;
exports.match = regular_expression_validator_1.RegularExpressionValidator.validateValue;
exports.checkString = string_validator_1.StringValidator.validateValue;
const checkInteger = function (value, variableName, options) {
    options = options || {};
    if (_.isPlainObject(variableName)) {
        options = variableName;
        variableName = undefined;
    }
    options = _.extend(options, {
        integerOnly: true
    });
    return number_validator_1.NumberValidator.validateValue(value, variableName, options);
};
exports.checkInteger = checkInteger;
const checkId = function (value, variableName, options) {
    options = options || {};
    if (_.isPlainObject(variableName)) {
        options = variableName;
        variableName = undefined;
    }
    options = _.extend(options, {
        integerOnly: true,
        min: 1,
        tooSmall: '{attribute} must be correct id.'
    });
    return number_validator_1.NumberValidator.validateValue(value, variableName, options);
};
exports.checkId = checkId;
