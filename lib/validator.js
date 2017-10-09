"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _String = require("underscore.string");
const error_list_1 = require("error-list");
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
    constructor(rules, data, attributeLabels, wrapToException = false) {
        this.rules = rules;
        this.data = data;
        this.attributeLabels = attributeLabels;
        this.wrapToException = wrapToException;
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
        if (!attributeLabels || _.isBoolean(attributeLabels)) {
            this.attributeLabels = {};
            this.wrapToException = false;
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
        const self = this;
        _.each(this.rules, function (rule) {
            const attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            const validator = rule[1];
            let options = rule[2] || {};
            if (_.isFunction(validator)) {
                _.each(attributes, function (attribute) {
                    if (self.isAvailableForValidation(self.data, attribute, options)) {
                        const error = validator(self.data[attribute], self.getAttributeLabel(attribute, options.lowercaseLabel), options);
                        if (error) {
                            self.addError(attribute, error);
                        }
                    }
                });
            }
            else if (_.isString(validator)) {
                if (validator === 'filter') {
                    _.each(attributes, function (attribute) {
                        if (_.has(self.data, attribute)) {
                            self.data[attribute] = filter_validator_1.FilterValidator.validate(options.filter, self.data[attribute]);
                        }
                    });
                }
                else if (validator === 'required') {
                    _.each(attributes, function (attribute) {
                        const error = new required_validator_1.RequiredValidator(self.getAttributeLabel(attribute, options.lowercaseLabel), self.data[attribute], options).validate();
                        if (error) {
                            self.addError(attribute, error);
                            self.requireErrors.push(attribute);
                        }
                    });
                }
                else if (validator === 'default') {
                    _.each(attributes, function (attribute) {
                        if (!self.isHasError(attribute)) {
                            self.data[attribute] = default_value_validator_1.DefaultValueValidator.validate(self.data[attribute], options.value);
                        }
                    });
                }
                else {
                    let validatorClass = self.defaultValidators[validator];
                    if (!abstract_validator_1.AbstractValidator.isPrototypeOf(validatorClass)) {
                        options = _.extend(options, validatorClass.options);
                        validatorClass = validatorClass.class;
                    }
                    _.each(attributes, function (attribute) {
                        if (self.isAvailableForValidation(self.data, attribute, options)) {
                            const error = new validatorClass(self.getAttributeLabel(attribute, options.lowercaseLabel), self.data[attribute], options).validate();
                            if (error) {
                                self.addError(attribute, error);
                            }
                        }
                    });
                }
            }
        });
        return _.size(this.errors) ? this.wrapToException ? new error_list_1.ValidationError(this.errors) : this.errors : null;
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
    isAvailableForValidation(data, attribute, options) {
        if (this.requireErrors.indexOf(attribute) !== -1) {
            return false;
        }
        if (options.skipOnEmpty && base_validator_1.BaseValidator.isEmptyValue(data[attribute])) {
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
exports.validate = function (rules, data, attributeLabels, wrapToException) {
    return new Validator(rules, data, attributeLabels, wrapToException).validate();
};
