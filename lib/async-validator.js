"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
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
    rules;
    data;
    attributeLabels;
    mixin;
    errors = {};
    requireErrors = [];
    constructor(rules, data, attributeLabels = {}, mixin = {}) {
        this.rules = rules;
        this.data = data;
        this.attributeLabels = attributeLabels;
        this.mixin = mixin;
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
    defaultValidators = {
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
    async validate() {
        for (const rule of this.rules) {
            const attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            const validator = rule[1];
            let options = rule[2] || {};
            options.mixin = _.extend({}, this.mixin);
            if (_.isFunction(validator)) {
                for (const attribute of attributes) {
                    if (await this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                        const error = await validator(this.data[attribute], this.getAttributeLabel(attribute, options.lowercaseLabel), options);
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
                        if (_.isFunction(options.skip) && await options.skip(this.data[attribute], attributeLabel, options)) {
                            continue;
                        }
                        // hasOwnProperty returns false for getters/setters
                        if (attribute in this.data) {
                            this.data[attribute] = await async_filter_validator_1.AsyncFilterValidator.validate(options.filter, this.data[attribute]);
                        }
                    }
                }
                else if (validator === 'required') {
                    for (const attribute of attributes) {
                        const attributeLabel = this.getAttributeLabel(attribute, options.lowercaseLabel);
                        if (_.isFunction(options.skip) && await options.skip(this.data[attribute], attributeLabel, options)) {
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
                        if (_.isFunction(options.skip) && await options.skip(this.data[attribute], this.getAttributeLabel(attribute, options.lowercaseLabel), options)) {
                            continue;
                        }
                        if (!this.isHasError(attribute)) {
                            this.data[attribute] = await async_default_value_validator_1.AsyncDefaultValueValidator.validate(this.data[attribute], options.value);
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
                        if (await this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                            const error = await new validatorClass(this.getAttributeLabel(attribute, options.lowercaseLabel), this.data[attribute], options).validate();
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
    async isAvailableForValidation(value, attribute, options) {
        if (_.isFunction(options.skip) && await options.skip(value, this.getAttributeLabel(attribute, options.lowercaseLabel), options)) {
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
const validate = async function (rules, data, attributeLabels, mixin) {
    return await new Validator(rules, data, attributeLabels, mixin).validate();
};
exports.validate = validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FzeW5jLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBNEI7QUFDNUIsNkNBQTZDO0FBQzdDLHdFQUFvRTtBQUNwRSxnRkFBMkU7QUFDM0UsOEZBQXdGO0FBQ3hGLHdFQUFvRTtBQUNwRSxrRUFBOEQ7QUFDOUQsc0VBQWtFO0FBQ2xFLGtGQUE2RTtBQUM3RSxvRUFBZ0U7QUFDaEUsa0VBQThEO0FBQzlELDhFQUF5RTtBQUN6RSw0RkFBdUY7QUFDdkYsb0VBQWdFO0FBQ2hFLGdFQUE0RDtBQUc1RCxNQUFNLFNBQVM7SUFJUTtJQUFtQjtJQUFrQjtJQUE2QjtJQUhyRixNQUFNLEdBQVEsRUFBRSxDQUFDO0lBQ2pCLGFBQWEsR0FBYSxFQUFFLENBQUM7SUFFN0IsWUFBbUIsS0FBVSxFQUFTLElBQVMsRUFBUyxrQkFBa0IsRUFBRSxFQUFTLFFBQVEsRUFBRTtRQUE1RSxVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBSztRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFLO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUMzRixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FB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