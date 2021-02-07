"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const _ = require("lodash");
const _String = require("underscore.string");
const abstract_validator_1 = require("./validators/abstract-validator");
const filter_validator_1 = require("./validators/filter-validator");
const default_value_validator_1 = require("./validators/default-value-validator");
const required_validator_1 = require("./validators/required-validator");
const array_validator_1 = require("./validators/array-validator");
const boolean_validator_1 = require("./validators/boolean-validator");
const compare_validator_1 = require("./validators/compare-validator");
const number_validator_1 = require("./validators/number-validator");
const email_validator_1 = require("./validators/email-validator");
const range_validator_1 = require("./validators/range-validator");
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
            filter: filter_validator_1.FilterValidator,
            default: default_value_validator_1.DefaultValueValidator,
            required: required_validator_1.RequiredValidator,
            array: array_validator_1.ArrayValidator,
            boolean: boolean_validator_1.BooleanValidator,
            compare: compare_validator_1.CompareValidator,
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
            in: range_validator_1.RangeValidator,
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
        for (const rule of this.rules) {
            const attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            const validator = rule[1];
            let options = rule[2] || {};
            options.mixin = _.extend({}, this.mixin);
            if (_.isFunction(validator)) {
                for (const attribute of attributes) {
                    if (this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                        const error = validator(this.data[attribute], this.getAttributeLabel(attribute, options.lowercaseLabel), options);
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
                        if (_.isFunction(options.skip) && options.skip(this.data[attribute], attributeLabel, options)) {
                            continue;
                        }
                        // hasOwnProperty returns false for getters/setters
                        if (attribute in this.data) {
                            this.data[attribute] = filter_validator_1.FilterValidator.validate(options.filter, this.data[attribute]);
                        }
                    }
                }
                else if (validator === 'required') {
                    for (const attribute of attributes) {
                        const attributeLabel = this.getAttributeLabel(attribute, options.lowercaseLabel);
                        if (_.isFunction(options.skip) && options.skip(this.data[attribute], attributeLabel, options)) {
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
                        if (_.isFunction(options.skip) && options.skip(this.data[attribute], this.getAttributeLabel(attribute, options.lowercaseLabel), options)) {
                            continue;
                        }
                        if (!this.isHasError(attribute)) {
                            this.data[attribute] = default_value_validator_1.DefaultValueValidator.validate(this.data[attribute], options.value);
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
                        if (this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                            const error = new validatorClass(this.getAttributeLabel(attribute, options.lowercaseLabel), this.data[attribute], options).validate();
                            if (error) {
                                this.addError(attribute, error);
                            }
                        }
                    }
                }
            }
        }
        return _.size(this.errors) ? this.errors : undefined;
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
        if (_.isFunction(options.skip) && options.skip(value, this.getAttributeLabel(attribute, options.lowercaseLabel), options)) {
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
    }
    getAttributeLabel(attribute, lowercase) {
        let label = !_.isUndefined(this.attributeLabels) && !_.isUndefined(this.attributeLabels[attribute]) ? this.attributeLabels[attribute] : attribute;
        label = _String.humanize(label);
        return lowercase ? _String.decapitalize(label) : label;
        // label = label.replace(/_/g, ' ').trim();
        // return lowercase ? _String.decapitalize(label) : _String.capitalize(label);
    }
}
const validate = function (rules, data, attributeLabels, mixin) {
    return new Validator(rules, data, attributeLabels, mixin).validate();
};
exports.validate = validate;
