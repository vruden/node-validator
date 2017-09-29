import * as _ from 'lodash';
import * as _String from 'underscore.string';
import { ValidationError } from 'error-list';
import { AbstractValidator } from './validators/abstract-validator';
import { FilterValidator } from './validators/filter-validator';
import { DefaultValueValidator } from './validators/default-value-validator';
import { RequiredValidator } from './validators/required-validator';
import { ArrayValidator } from './validators/array-validator';
import { BooleanValidator } from './validators/boolean-validator';
import { CompareValidator } from './validators/compare-validator';
import { NumberValidator } from './validators/number-validator';
import { EmailValidator } from './validators/email-validator';
import { RangeValidator } from './validators/range-validator';
import { RegularExpressionValidator } from './validators/regular-expression-validator';
import { StringValidator } from './validators/string-validator';
import { BaseValidator } from './validators/base-validator';


class Validator {
    errors: any = {};
    requireErrors: string[] = [];

    constructor(public rules, public data, public attributeLabels?, public wrapToException: boolean = false) {
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
                case 'filter' :
                    return 2;
                case 'default':
                    return 4;
                default :
                    return 3;
            }
        });
    }

    defaultValidators = {
        filter: FilterValidator,
        default: DefaultValueValidator,
        required: RequiredValidator,

        array: ArrayValidator,
        boolean: BooleanValidator,
        compare: CompareValidator,
        double: NumberValidator,
        email: EmailValidator,
        id: {
            class: NumberValidator,
            options: {
                integerOnly: true,
                min: 1,
                tooSmall: '{attribute} must be correct id.'
            }
        },
        in: RangeValidator,
        integer: {
            class: NumberValidator,
            options: {
                integerOnly: true
            }
        },
        match: RegularExpressionValidator,
        number: NumberValidator,
        string: StringValidator
    };

    validate() {
        const self = this;

        _.each(this.rules, function (rule) {
            const attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            const validator = rule[1];
            let options: any = rule[2] || {};

            if (_.isFunction(validator)) {
                _.each(attributes, function (attribute) {
                    if (self.isAvailableForValidation(self.data, attribute, options)) {
                        const error = validator(self.data[attribute], self.getAttributeLabel(attribute, options.lowercaseLabel), options);

                        if (error) {
                            self.addError(attribute, error);
                        }
                    }
                });
            } else if (_.isString(validator)) {
                if (validator === 'filter') {
                    _.each(attributes, function (attribute) {
                        if (_.has(self.data, attribute)) {
                            self.data[attribute] = FilterValidator.validate(options.filter, self.data[attribute]);
                        }
                    });
                } else if (validator === 'required') {
                    _.each(attributes, function (attribute) {
                        const error = new RequiredValidator(self.getAttributeLabel(attribute, options.lowercaseLabel), self.data[attribute], options).validate();

                        if (error) {
                            self.addError(attribute, error);
                            self.requireErrors.push(attribute);
                        }
                    });
                } else if (validator === 'default') {
                    _.each(attributes, function (attribute) {
                        if (!self.isHasError(attribute)) {
                            self.data[attribute] = DefaultValueValidator.validate(self.data[attribute], options.value);
                        }
                    });
                } else {
                    let validatorClass = self.defaultValidators[validator];

                    if (!AbstractValidator.isPrototypeOf(validatorClass)) {
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

        return _.size(this.errors) ? this.wrapToException ? new ValidationError(this.errors) : this.errors : null;
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

        if (options.skipOnEmpty && BaseValidator.isEmptyValue(data[attribute])) {
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

export const validate = function (rules, data, attributeLabels?, wrapToException?: boolean) {
    return new Validator(rules, data, attributeLabels, wrapToException).validate();
};