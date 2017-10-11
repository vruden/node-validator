"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _String = require("underscore.string");
const abstract_validator_1 = require("./validators/abstract-validator");
const async_filter_validator_1 = require("./validators/async-filter-validator");
const async_default_value_validator_1 = require("./validators/async-default-value-validator");
const required_validator_1 = require("./validators/required-validator");
const array_validator_1 = require("./validators/array-validator");
const boolean_validator_1 = require("./validators/boolean-validator");
const async_compare_validator_1 = require("./validators/async-compare-validator");
const number_validator_1 = require("./validators/number-validator");
const email_validator_1 = require("./validators/email-validator");
const async_range_validator_1 = require("./validators/async-range-validator");
const regular_expression_validator_1 = require("./validators/regular-expression-validator");
const string_validator_1 = require("./validators/string-validator");
const base_validator_1 = require("./validators/base-validator");
class Validator {
    constructor(rules, data, attributeLabels = {}, mixin = {}) {
        this.rules = rules;
        this.data = data;
        this.attributeLabels = attributeLabels;
        this.mixin = mixin;
        this.errors = {};
        this.requireErrors = [];
        this.defaultValidators = {
            filter: async_filter_validator_1.AsyncFilterValidator,
            default: async_default_value_validator_1.AsyncDefaultValueValidator,
            required: required_validator_1.RequiredValidator,
            array: array_validator_1.ArrayValidator,
            boolean: boolean_validator_1.BooleanValidator,
            compare: async_compare_validator_1.AsyncCompareValidator,
            double: number_validator_1.NumberValidator,
            email: email_validator_1.EmailValidator,
            id: {
                class: number_validator_1.NumberValidator,
                options: {
                    integerOnly: true,
                    min: 1,
                    tooSmall: '{attribute} must be correct id.'
                }
            },
            in: async_range_validator_1.AsyncRangeValidator,
            integer: {
                class: number_validator_1.NumberValidator,
                options: {
                    integerOnly: true
                }
            },
            match: regular_expression_validator_1.RegularExpressionValidator,
            number: number_validator_1.NumberValidator,
            string: string_validator_1.StringValidator
        };
        for (const rule of this.rules) {
            if (rule.length < 2) {
                throw new Error(`Rule should contain at least 2 arguments: ${rule}`);
            }
            const validator = _.isString(rule[1]) ? rule[1].trim() : rule[1];
            if (!_.isFunction(validator) && !_.has(this.defaultValidators, validator)) {
                throw new Error(`Validator not found ${validator}`);
            }
        }
        this.rules = _.sortBy(this.rules, function (rule) {
            switch (rule[1]) {
                case 'required':
                    return 1;
                case 'filter':
                    return 2;
                case 'default':
                    return 4;
                default:
                    return 3;
            }
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const rule of this.rules) {
                const attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
                const validator = rule[1];
                let options = rule[2] || {};
                options.mixin = _.extend({}, this.mixin);
                if (_.isFunction(validator)) {
                    for (const attribute of attributes) {
                        if (yield this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                            const error = yield validator(this.data[attribute], this.getAttributeLabel(attribute, options.lowercaseLabel), options);
                            if (error) {
                                this.addError(attribute, error);
                            }
                        }
                    }
                }
                else if (_.isString(validator)) {
                    if (validator === 'filter') {
                        for (const attribute of attributes) {
                            const attributeLabel = this.getAttributeLabel(attribute, options.lowercaseLabel);
                            if (_.isFunction(options.skip) && (yield options.skip(this.data[attribute], attributeLabel, options))) {
                                continue;
                            }
                            if (_.has(this.data, attribute)) {
                                this.data[attribute] = yield async_filter_validator_1.AsyncFilterValidator.validate(options.filter, this.data[attribute]);
                            }
                        }
                    }
                    else if (validator === 'required') {
                        for (const attribute of attributes) {
                            const attributeLabel = this.getAttributeLabel(attribute, options.lowercaseLabel);
                            if (_.isFunction(options.skip) && (yield options.skip(this.data[attribute], attributeLabel, options))) {
                                continue;
                            }
                            const error = new required_validator_1.RequiredValidator(attributeLabel, this.data[attribute], options).validate();
                            if (error) {
                                this.addError(attribute, error);
                                this.requireErrors.push(attribute);
                            }
                        }
                    }
                    else if (validator === 'default') {
                        for (const attribute of attributes) {
                            if (_.isFunction(options.skip) && (yield options.skip(this.data[attribute], this.getAttributeLabel(attribute, options.lowercaseLabel), options))) {
                                continue;
                            }
                            if (!this.isHasError(attribute)) {
                                this.data[attribute] = yield async_default_value_validator_1.AsyncDefaultValueValidator.validate(this.data[attribute], options.value);
                            }
                        }
                    }
                    else {
                        let validatorClass = this.defaultValidators[validator];
                        if (!abstract_validator_1.AbstractValidator.isPrototypeOf(validatorClass)) {
                            options = _.extend(options, validatorClass.options);
                            validatorClass = validatorClass.class;
                        }
                        for (const attribute of attributes) {
                            if (yield this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                                const error = yield new validatorClass(this.getAttributeLabel(attribute, options.lowercaseLabel), this.data[attribute], options).validate();
                                if (error) {
                                    this.addError(attribute, error);
                                }
                            }
                        }
                    }
                }
            }
            return _.size(this.errors) ? this.errors : undefined;
        });
    }
    isHasError(attribute) {
        return _.has(this.errors, attribute);
    }
    addError(attribute, error) {
        if (!this.errors[attribute]) {
            this.errors[attribute] = [];
        }
        this.errors[attribute].push(error);
    }
    isAvailableForValidation(value, attribute, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.isFunction(options.skip) && (yield options.skip(value, this.getAttributeLabel(attribute, options.lowercaseLabel), options))) {
                return false;
            }
            if (this.requireErrors.indexOf(attribute) !== -1) {
                return false;
            }
            if (options.skipOnEmpty && base_validator_1.BaseValidator.isEmptyValue(value)) {
                return false;
            }
            if (options.skipOnError && this.isHasError(attribute)) {
                return false;
            }
            return true;
        });
    }
    getAttributeLabel(attribute, lowercase) {
        let label = !_.isUndefined(this.attributeLabels) && !_.isUndefined(this.attributeLabels[attribute]) ? this.attributeLabels[attribute] : attribute;
        label = _String.humanize(label);
        return lowercase ? _String.decapitalize(label) : label;
        // label = label.replace(/_/g, ' ').trim();
        // return lowercase ? _String.decapitalize(label) : _String.capitalize(label);
    }
}
exports.validate = function (rules, data, attributeLabels, mixin) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Validator(rules, data, attributeLabels, mixin).validate();
    });
};
