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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBNEI7QUFDNUIsNkNBQTZDO0FBQzdDLHdFQUFvRTtBQUNwRSxvRUFBZ0U7QUFDaEUsa0ZBQTZFO0FBQzdFLHdFQUFvRTtBQUNwRSxrRUFBOEQ7QUFDOUQsc0VBQWtFO0FBQ2xFLHNFQUFrRTtBQUNsRSxvRUFBZ0U7QUFDaEUsa0VBQThEO0FBQzlELGtFQUE4RDtBQUM5RCw0RkFBdUY7QUFDdkYsb0VBQWdFO0FBQ2hFLGdFQUE0RDtBQUc1RCxNQUFNLFNBQVM7SUFJUTtJQUFtQjtJQUFrQjtJQUE2QjtJQUhyRixNQUFNLEdBQVEsRUFBRSxDQUFDO0lBQ2pCLGFBQWEsR0FBYSxFQUFFLENBQUM7SUFFN0IsWUFBbUIsS0FBVSxFQUFTLElBQVMsRUFBUyxrQkFBa0IsRUFBRSxFQUFTLFFBQVEsRUFBRTtRQUE1RSxVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBSztRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFLO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUMzRixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDeEUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUN4RCxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsSUFBSTtZQUM1QyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNkLEtBQUssVUFBVTtvQkFDWCxPQUFPLENBQUMsQ0FBQztnQkFDYixLQUFLLFFBQVE7b0JBQ1QsT0FBTyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxTQUFTO29CQUNWLE9BQU8sQ0FBQyxDQUFDO2dCQUNiO29CQUNJLE9BQU8sQ0FBQyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxpQkFBaUIsR0FBRztRQUNoQixNQUFNLEVBQUUsa0NBQWU7UUFDdkIsT0FBTyxFQUFFLCtDQUFxQjtRQUM5QixRQUFRLEVBQUUsc0NBQWlCO1FBRTNCLEtBQUssRUFBRSxnQ0FBYztRQUNyQixPQUFPLEVBQUUsb0NBQWdCO1FBQ3pCLE9BQU8sRUFBRSxvQ0FBZ0I7UUFDekIsTUFBTSxFQUFFLGtDQUFlO1FBQ3ZCLEtBQUssRUFBRSxnQ0FBYztRQUNyQixFQUFFLEVBQUU7WUFDQSxLQUFLLEVBQUUsa0NBQWU7WUFDdEIsT0FBTyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixHQUFHLEVBQUUsQ0FBQztnQkFDTixRQUFRLEVBQUUsaUNBQWlDO2FBQzlDO1NBQ0o7UUFDRCxFQUFFLEVBQUUsZ0NBQWM7UUFDbEIsT0FBTyxFQUFFO1lBQ0wsS0FBSyxFQUFFLGtDQUFlO1lBQ3RCLE9BQU8sRUFBRTtnQkFDTCxXQUFXLEVBQUUsSUFBSTthQUNwQjtTQUNKO1FBQ0QsS0FBSyxFQUFFLHlEQUEwQjtRQUNqQyxNQUFNLEVBQUUsa0NBQWU7UUFDdkIsTUFBTSxFQUFFLGtDQUFlO0tBQzFCLENBQUM7SUFFRixRQUFRO1FBQ0osS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDNUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLE9BQU8sR0FBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXpDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUMxQixLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRSxDQUFDO29CQUNqQyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDO3dCQUMxRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFFbEgsSUFBSSxLQUFLLEVBQUUsQ0FBQzs0QkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDcEMsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO2lCQUFNLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUMvQixJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDekIsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBRWpGLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDOzRCQUM1RixTQUFTO3dCQUNiLENBQUM7d0JBRUQsbURBQW1EO3dCQUNuRCxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsa0NBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQzFGLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO3FCQUFNLElBQUksU0FBUyxLQUFLLFVBQVUsRUFBRSxDQUFDO29CQUNsQyxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFFakYsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7NEJBQzVGLFNBQVM7d0JBQ2IsQ0FBQzt3QkFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLHNDQUFpQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUU5RixJQUFJLEtBQUssRUFBRSxDQUFDOzRCQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDdkMsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7cUJBQU0sSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ2pDLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7NEJBQ3ZJLFNBQVM7d0JBQ2IsQ0FBQzt3QkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDOzRCQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLCtDQUFxQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDL0YsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDSixJQUFJLGNBQWMsR0FBUyxJQUFJLENBQUMsaUJBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBRTlELElBQUksQ0FBQyxzQ0FBaUIsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQzt3QkFDbkQsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDcEQsY0FBYyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUM7b0JBQzFDLENBQUM7b0JBRUQsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUUsQ0FBQzt3QkFDakMsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQzs0QkFDMUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs0QkFFdEksSUFBSSxLQUFLLEVBQUUsQ0FBQztnQ0FDUixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDcEMsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3pELENBQUM7SUFFRCxVQUFVLENBQUMsU0FBYztRQUNyQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsUUFBUSxDQUFDLFNBQWMsRUFBRSxLQUFVO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCx3QkFBd0IsQ0FBQyxLQUFVLEVBQUUsU0FBYyxFQUFFLE9BQVk7UUFDN0QsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3hILE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDL0MsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSw4QkFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ3BELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsU0FBYyxFQUFFLFNBQWM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQU8sSUFBSSxDQUFDLGVBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQU8sSUFBSSxDQUFDLGVBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNoSyxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVoQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRXZELDJDQUEyQztRQUMzQyw4RUFBOEU7SUFDbEYsQ0FBQztDQUNKO0FBRU0sTUFBTSxRQUFRLEdBQUcsVUFBVSxLQUFVLEVBQUUsSUFBUyxFQUFFLGVBQXFCLEVBQUUsS0FBVztJQUN2RixPQUFPLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pFLENBQUMsQ0FBQztBQUZXLFFBQUEsUUFBUSxZQUVuQiJ9