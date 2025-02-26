import * as _ from 'lodash';
import * as _String from 'underscore.string';
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

    constructor(
        public rules: any,
        public data: any,
        public attributeLabels = {},
        public mixin = {}
    ) {
        for (const rule of this.rules) {
            if (rule.length < 2) {
                throw new Error(`Rule should contain at least 2 arguments: ${rule}`);
            }

            const validator = _.isString(rule[1]) ? rule[1].trim() : rule[1];

            if (!_.isFunction(validator) && !_.has(this.defaultValidators, validator)) {
                throw new Error(`Validator not found ${validator}`);
            }
        }

        // eslint-disable-next-line func-names
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
        for (const rule of this.rules) {
            const attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            const validator = rule[1];
            let options: any = rule[2] || {};
            options.mixin = _.extend({}, this.mixin);

            if (_.isFunction(validator)) {
                for (const attribute of attributes) {
                    if (this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                        const error = validator(
                            this.data[attribute],
                            this.getAttributeLabel(attribute, options.lowercaseLabel),
                            options
                        );

                        if (error) {
                            this.addError(attribute, error);
                        }
                    }
                }
            } else if (_.isString(validator)) {
                if (validator === 'filter') {
                    for (const attribute of attributes) {
                        const attributeLabel = this.getAttributeLabel(attribute, options.lowercaseLabel);

                        if (_.isFunction(options.skip) && options.skip(this.data[attribute], attributeLabel, options)) {
                            continue;
                        }

                        // hasOwnProperty returns false for getters/setters
                        if (attribute in this.data) {
                            this.data[attribute] = FilterValidator.validate(options.filter, this.data[attribute]);
                        }
                    }
                } else if (validator === 'required') {
                    for (const attribute of attributes) {
                        const attributeLabel = this.getAttributeLabel(attribute, options.lowercaseLabel);

                        if (_.isFunction(options.skip) && options.skip(this.data[attribute], attributeLabel, options)) {
                            continue;
                        }

                        const error = new RequiredValidator(attributeLabel, this.data[attribute], options).validate();

                        if (error) {
                            this.addError(attribute, error);
                            this.requireErrors.push(attribute);
                        }
                    }
                } else if (validator === 'default') {
                    for (const attribute of attributes) {
                        if (
                            _.isFunction(options.skip) &&
                            options.skip(
                                this.data[attribute],
                                this.getAttributeLabel(attribute, options.lowercaseLabel),
                                options
                            )
                        ) {
                            continue;
                        }

                        if (!this.isHasError(attribute)) {
                            this.data[attribute] = DefaultValueValidator.validate(this.data[attribute], options.value);
                        }
                    }
                } else {
                    let validatorClass = (<any>this.defaultValidators)[validator];

                    if (!AbstractValidator.isPrototypeOf(validatorClass)) {
                        options = _.extend(options, validatorClass.options);
                        validatorClass = validatorClass.class;
                    }

                    for (const attribute of attributes) {
                        if (this.isAvailableForValidation(this.data[attribute], attribute, options)) {
                            // eslint-disable-next-line new-cap
                            const error = new validatorClass(
                                this.getAttributeLabel(attribute, options.lowercaseLabel),
                                this.data[attribute],
                                options
                            ).validate();

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

    isHasError(attribute: any) {
        return _.has(this.errors, attribute);
    }

    addError(attribute: any, error: any) {
        if (!this.errors[attribute]) {
            this.errors[attribute] = [];
        }

        this.errors[attribute].push(error);
    }

    isAvailableForValidation(value: any, attribute: any, options: any) {
        if (
            _.isFunction(options.skip) &&
            options.skip(value, this.getAttributeLabel(attribute, options.lowercaseLabel), options)
        ) {
            return false;
        }

        if (this.requireErrors.indexOf(attribute) !== -1) {
            return false;
        }

        if (options.skipOnEmpty && BaseValidator.isEmptyValue(value)) {
            return false;
        }

        if (options.skipOnError && this.isHasError(attribute)) {
            return false;
        }

        return true;
    }

    getAttributeLabel(attribute: any, lowercase: any) {
        let label =
            !_.isUndefined(this.attributeLabels) && !_.isUndefined((<any>this.attributeLabels)[attribute])
                ? (<any>this.attributeLabels)[attribute]
                : attribute;
        label = _String.humanize(label);

        return lowercase ? _String.decapitalize(label) : label;

        // label = label.replace(/_/g, ' ').trim();
        // return lowercase ? _String.decapitalize(label) : _String.capitalize(label);
    }
}

// eslint-disable-next-line func-names
export const validate = function (rules: any, data: any, attributeLabels?: any, mixin?: any) {
    return new Validator(rules, data, attributeLabels, mixin).validate();
};
