'use strict';

var _ = require('lodash');
var _String = require('underscore.string');

var defaultValidators = {
    filter: filter,
    default: defaultValue,
    required: requiredValidator,

    array: arrayValidator,
    boolean: booleanValidator,
    compare: compareValidator,
    double: numberValidator,
    email: emailValidator,
    id: {
        function: numberValidator,
        options: {
            integerOnly: true,
            min: 1,
            tooSmall: '{attribute} must be correct id.'
        }
    },
    in: rangeValidator,
    integer: {
        function: numberValidator,
        options: {
            integerOnly: true
        }
    },
    match: regularExpressionValidator,
    number: numberValidator,
    string: stringValidator
};

/**
 *
 * @type {{validate: Function}}
 *
 */
var Validator = {

    /**
     *
     * @param rules {String|Array}
     * @param data {Object}
     * @param attributeLabels {Object}
     * @returns {Object|null}
     *
     * @throws Error
     */
    validate: function (rules, data, attributeLabels) {
        checkRulesFormat();

        var errors = {};
        var requireErrors = [];

        rules = _.sortBy(rules, function (rule) {
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

        _.each(rules, function (rule) {
            var attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            var validator = rule[1];
            var options = rule[2] || {};

            if (_.isFunction(validator)) {
                _.each(attributes, function (attribute) {
                    if (isAvailableForValidation(data, attribute, options)) {
                        var error = validator(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options);

                        if (error) {
                            addError(attribute, error);
                        }
                    }
                });
            } else if (_.isString(validator)) {
                if (validator === 'filter') {
                    _.each(attributes, function (attribute) {
                        if (_.has(data, attribute)) {
                            data[attribute] = filter(options.filter, data[attribute]);
                        }
                    });
                } else if (validator === 'required') {
                    _.each(attributes, function (attribute) {
                        var error = requiredValidator(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options);

                        if (error) {
                            addError(attribute, error);
                            requireErrors.push(attribute)
                        }
                    });
                } else if (validator === 'default') {
                    _.each(attributes, function (attribute) {
                        if (!isHasError(attribute)) {
                            data[attribute] = defaultValue(data[attribute], options.value);
                        }
                    });
                } else {
                    var fn = defaultValidators[validator];

                    if (!_.isFunction(fn)) {
                        options = _.extend(options, fn.options);
                        fn = fn.function;
                    }

                    _.each(attributes, function (attribute) {
                        //attributes = _.intersection(attributes, _.keys(data));
                        if (isAvailableForValidation(data, attribute, options)) {
                            var error = fn(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options);

                            if (error) {
                                addError(attribute, error);
                            }
                        }
                    });
                }
            }
        });

        return _.size(errors) ? errors : null;


        function checkRulesFormat() {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].length < 2) {
                    throw new Error('Rule should contain at least 2 arguments:' + rules[i]);
                }

                var validator = rules[i][1];

                if (!_.isFunction(validator) && !_.has(defaultValidators, validator)) {
                    throw new Error('Validator not found ' + validator);
                }
            }
        }

        function isAvailableForValidation(data, attribute, options) {
            if (~requireErrors.indexOf(attribute)) {
                return false
            }

            if (options.skipOnEmpty && (!data[attribute] || (_.isArray(data[attribute]) && _.isEmpty(data[attribute])))) {
                return false;
            }

            if (options.skipOnError && isHasError(attribute)) {
                return false;
            }

            return true;
        }

        function isHasError(attribute) {
            return _.has(errors, attribute);
        }

        function getAttributeLabel(attribute, lowercase) {
            var label = !_.isUndefined(attributeLabels) && !_.isUndefined(attributeLabels[attribute]) ? attributeLabels[attribute] : attribute;
            label = _String.humanize(label);
            return lowercase ? _String.decapitalize(label) : label;

            //label = label.replace(/_/g, ' ').trim();
            //return lowercase ? _String.decapitalize(label) : _String.capitalize(label);
        }

        function addError(attribute, error) {
            if (!errors[attribute]) {
                errors[attribute] = [];
            }

            errors[attribute].push(error);
        }
    }
};

module.exports = Validator;

function isInteger(value) {
    return _.isNumber(value) && value % 1 === 0;
}

function isId(value) {
    return isInteger(value) && value > 0;
}

function filter(filter, value) {
    if (!_.isFunction(filter)) {
        throw new Error('The `filter` property must be set.');
    }

    if (_.isUndefined(value) || _.isNull(value)) {
        return value;
    }

    return filter(value);
}

function defaultValue(value, defaultValue) {
    if (isEmpty(value)) {

        return _.isFunction(defaultValue) ? defaultValue() : defaultValue;
    }

    return value;

    function isEmpty(value) {
        return _.isUndefined(value) || _.isNull(value) || value === '' || (_.isArray(value) && _.isEmpty(value));
    }
}

function requiredValidator(value, attributeLabel, options) {
    var message =  options.message || '{attribute} cannot be blank.';

    if (_.isUndefined(value)) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function rangeValidator(value, attributeLabel, options) {
    if (!_.isArray(options.range) || _.isEmpty(options.range)) {
        throw new Error('The `range` property must be set.');
    }

    var not = !!options.not;
    var strict = !!options.strict;
    var message =  options.message || '{attribute} is invalid.';
    var range = options.range;
    var result = false;

    if (strict) {
        result = ~_.indexOf(range, value);
    } else {
        for (var i = 0; i < range.length; i++) {
            if (value == range[i]) {
                result = true;
                break;
            }
        }
    }

    result = not ? !result : !!result;

    if (!result) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function booleanValidator(value, attributeLabel, options) {
    var strict = !!options.strict;
    var message =  options.message || '{attribute} is not boolean.';
    var result = false;

    if (strict) {
        result = value === true || value === false;
    } else {
        result = value == true || value == false;
    }

    if (!result) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function arrayValidator(value, attributeLabel, options) {
    var message =  options.message || '{attribute} must be an array.';
    var emptyMessage =  options.emptyMessage || '{attribute} must not be empty.';
    var typeMessage =  options.typeMessage || '{attribute} is not an array of {type}.';

    var notEmpty = options.notEmpty | false;
    var type = options.type || false;

    if (!_.isArray(value)) {
        return message.replace('{attribute}', attributeLabel);
    }

    if (notEmpty && _.isEmpty(value)) {
        return emptyMessage.replace('{attribute}', attributeLabel);
    }

    if (type) {
        var typeFn = null;

        if (_.isFunction(type)) {
            typeFn = type;
        } else {
            switch (type) {
                case 'string':
                    typeFn = _.isString;
                    break;
                case 'number':
                    typeFn = _.isNumber;
                    break;
                case 'integer':
                    typeFn = isInteger;
                    break;
                case 'id':
                    typeFn = isId;
                    break;
            }
        }

        if (_.isNull(typeFn)) {
            throw new Error('The `type` property is wrong.');
        }

        var isValid = true;

        for (var i = 0; i < value.length; i++) {
            if (!typeFn(value[i])) {
                isValid = false;
            }
        }

        if (!isValid) {
            return typeMessage.replace('{attribute}', attributeLabel).replace('{type}', type);
        }
    }

    return false;
}

function compareValidator(value, attributeLabel, options) {
    if (_.isUndefined(options.compareValue)) {
        throw new Error('The `compareValue` property must be set.');
    }

    var compareValue = options.compareValue;
    var message =  options.message || '{attribute} is invalid.';
    var operator =  options.operator || '==';
    var result = false;

    switch (operator) {
        case '==':
            result = compareValue == value;
            break;
        case '===':
            result = compareValue === value;
            break;
        case '!=':
            result = compareValue != value;
            break;
        case '!==':
            result = compareValue !== value;
            break;
        case '>':
            result = compareValue > value;
            break;
        case '>=':
            result = compareValue >= value;
            break;
        case '<':
            result = compareValue < value;
            break;
        case '<=':
            result = compareValue <= value;
            break;
    }

    if (!result) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function regularExpressionValidator(value, attributeLabel, options) {
    if (_.isUndefined(options.pattern) || !_.isRegExp(options.pattern)) {
        throw new Error('The `pattern` property must be set.');
    }

    var message =  options.message || '{attribute} is invalid.';

    var result = options.pattern.test(value);
    if (options.not) {
        result = !result;
    }

    if (!result) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function emailValidator(value, attributeLabel, options) {
    //var pattern = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    //var fullPattern = /^[^@]*<[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>$/;
    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var message =  options.message || '{attribute} is not a valid email address.';

    if (!_.isString(value) || value.length > 320 || !pattern.test(value)) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function stringValidator(value, attributeLabel, options) {
    var message = options.message || '{attribute} must be a string.';
    var tooShort = options.tooShort || '{attribute} should contain at least {min} characters.';
    var tooLong = options.tooLong || '{attribute} should contain at most {max} characters.';
    var notEqual = options.notEqual || '{attribute} should contain {length} characters.';

    var length = options.length;
    var max = options.max;
    var min = options.min;

    if (_.isArray(length)) {
        if (length[0]) {
            min = length[0];
        }
        if (length[1]) {
            max = length[1];
        }
        length = null;
    }

    if (!_.isString(value)) {
        return message.replace('{attribute}', attributeLabel);
    }

    var _length = value.length;

    if (length && length !== _length) {
        return notEqual.replace('{attribute}', attributeLabel).replace('{length}', length);
    } else {
        if (min && min > _length) {
            return tooShort.replace('{attribute}', attributeLabel).replace('{min}', min);
        }

        if (max && max < _length) {
            return tooLong.replace('{attribute}', attributeLabel).replace('{max}', max);
        }
    }


    return false;
}

function numberValidator(value, attributeLabel, options) {
    //var integerPattern = /^\s*[+-]?\d+\s*$/;
    //var numberPattern = /^\s*[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?\s*$/;

    var integerMessage = options.message || '{attribute} must be an integer.';
    var numberMessage = options.message || '{attribute} must be an number.';
    var tooSmall = options.tooSmall || '{attribute} must be no less than {min}.';
    var tooBig = options.tooBig || '{attribute} must be no greater than {max}.';


    var integerOnly = options.integerOnly;
    var min = options.min || null;
    var max = options.max || null;

    //var pattern = integerOnly ? integerPattern : numberPattern;
    var message = integerOnly ? integerMessage : numberMessage;

    //if (!pattern.test(value)) {
    if (!_.isNumber(value) || (integerOnly && !isInteger(value))) {
        return message.replace('{attribute}', attributeLabel);
    }

    if (min && value < min) {
        return tooSmall.replace('{attribute}', attributeLabel).replace('{min}', min);
    }

    if (max && value > max) {
        return tooBig.replace('{attribute}', attributeLabel).replace('{max}', max);
    }

    return false;
}