'use strict';

var _ = require('lodash');
var _String = require('underscore.string');
var ValidationError = require('node-errors').ValidationError;

var defaultValidators = {
    filter: filter,
    default: defaultValue,
    required: requiredValidator,

    array: {
        function: arrayValidator,
        options: {
            async: false
        }
    },
    boolean: {
        function: booleanValidator,
        options: {
            async: false
        }
    },
    compare: {
        function: compareValidator,
        options: {
            async: true
        }
    },
    double: {
        function: numberValidator,
        options: {
            async: false
        }
    },
    email: {
        function: emailValidator,
        options: {
            async: false
        }
    },
    id: {
        function: numberValidator,
        options: {
            integerOnly: true,
            min: 1,
            tooSmall: '{attribute} must be correct id.',
            async: false
        }
    },
    in: {
        function: rangeValidator,
        options: {
            async: true
        }
    },
    integer: {
        function: numberValidator,
        options: {
            integerOnly: true,
            async: false
        }
    },
    match: {
        function: regularExpressionValidator,
        options: {
            async: false
        }
    },
    number: {
        function: numberValidator,
        options: {
            async: false
        }
    },
    string: {
        function: stringValidator,
        options: {
            async: false
        }
    }
};

var Validator = {

    /**
     *
     * @param rules
     * @param data
     * @param attributeLabels
     * @param callback
     * @returns {*}
     */
    validate: function (rules, data, attributeLabels, mixins, callback) {
        if (_.isFunction(attributeLabels)) {
            callback = attributeLabels;
            attributeLabels = undefined;
        }

        if (_.isFunction(mixins)) {
            callback = mixins;
            mixins = undefined;
        }

        if (!_.isFunction(callback)) {
            throw new Error('Missing callback function');
        }

        attributeLabels = _.extend({}, attributeLabels);

        for (var i = 0; i < rules.length; i++) {
            if (rules[i].length < 2) {
                return callback(new Error('Rule should contain at least 2 arguments:' + rules[i]));
            }

            var validator = rules[i][1];

            if (!_.isFunction(validator) && !_.has(defaultValidators, validator)) {
                return callback(new Error('Validator not found ' + validator));
            }
        }

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

        checkNextRule();

        function checkNextRule() {
            var rule = rules.shift();

            if (!rule) {
                return callback(_.size(errors) ? new ValidationError(errors) : null);
            }

            var attributes = _.isArray(rule[0]) ? rule[0] : [rule[0]];
            var validator = rule[1];
            var options = _.extend({skipOnEmpty: true, skipOnError: true}, rule[2]);
            options.mixins = _.extend({}, mixins);

            checkNextAttribute();

            function checkNextAttribute() {
                var attribute = attributes.pop();

                if (!attribute) {
                    return checkNextRule();
                }

                if (_.isFunction(options.skip)) {
                    options.skip(attribute, options, function (err, skip) {
                        if (err) {
                            return callback(err);
                        }

                        if (skip) {
                            return checkNextAttribute();
                        }

                        check();
                    });
                } else {
                    check();
                }

                function check () {
                    if (_.isFunction(validator)) {
                        if (isAvailableForValidation(data, attribute, options)) {
                            if (options.async) {
                                validator(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options, function (error) {
                                    if (error) {
                                        if (error instanceof Error) {
                                            return callback(error);
                                        }

                                        addError(attribute, error);
                                    }

                                    checkNextAttribute();
                                });
                            } else {
                                try {
                                    var error = validator(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options);

                                    if (error) {
                                        addError(attribute, error);
                                    }
                                } catch (e) {
                                    return callback(e);
                                }

                                checkNextAttribute();
                            }
                        } else {
                            checkNextAttribute();
                        }
                    } else if (_.isString(validator)) {
                        if (validator === 'filter') {
                            if (_.has(data, attribute)) {
                                if (options.async) {
                                    filter(options.filter, data[attribute], options, function (error, value) {
                                        if (error) {
                                            return callback(error);
                                        }

                                        data[attribute] = value;

                                        checkNextAttribute();
                                    });
                                } else {
                                    try {
                                        data[attribute] = filter(options.filter, data[attribute]);
                                    } catch (e) {
                                        return callback(e);
                                    }

                                    checkNextAttribute();
                                }
                            } else {
                                checkNextAttribute();
                            }
                        } else if (validator === 'required') {
                            var error = requiredValidator(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options);

                            if (error) {
                                addError(attribute, error);
                                requireErrors.push(attribute)
                            }

                            return checkNextAttribute();
                        } else if (validator === 'default') {
                            if (!isHasError(attribute)) {
                                if (options.async) {
                                    defaultValue(data[attribute], options.value, options, function (error, value) {
                                        if (error) {
                                            return callback(error);
                                        }

                                        data[attribute] = value;

                                        checkNextAttribute();
                                    });
                                } else {
                                    try {
                                        data[attribute] = defaultValue(data[attribute], options.value);
                                    } catch (e) {
                                        return callback(e);
                                    }

                                    checkNextAttribute();
                                }
                            } else {
                                checkNextAttribute();
                            }
                        } else {
                            var fn = defaultValidators[validator];

                            if (!_.isFunction(fn)) {
                                options = _.extend(options, fn.options);
                                fn = fn.function;
                            }

                            if (isAvailableForValidation(data, attribute, options)) {
                                if (options.async) {
                                    fn(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options, function (error) {
                                        if (error) {
                                            if (error instanceof Error) {
                                                return callback(error);
                                            }

                                            addError(attribute, error);
                                        }

                                        checkNextAttribute();
                                    });
                                } else {
                                    try {
                                        var error = fn(data[attribute], getAttributeLabel(attribute, options.lowercaseLabel), options);

                                        if (error) {
                                            addError(attribute, error);
                                        }
                                    } catch (e) {
                                        return callback(e);
                                    }

                                    checkNextAttribute();
                                }
                            } else {
                                checkNextAttribute();
                            }
                        }
                    }
                }
            }
        }

        function isAvailableForValidation(data, attribute, options) {
            if (~requireErrors.indexOf(attribute)) {
                return false
            }

            if (options.skipOnEmpty && !_.isNumber(data[attribute]) && _.isEmpty(data[attribute])) {
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

        function addError(attribute, error) {
            if (!errors[attribute]) {
                errors[attribute] = [];
            }

            errors[attribute].push(error);
        }

        function getAttributeLabel(attribute, lowercase) {
            var label = !_.isUndefined(attributeLabels[attribute]) ? attributeLabels[attribute] : _String.humanize(attribute);
            return lowercase ? _String.decapitalize(label) : label;

            //label = label.replace(/_/g, ' ').trim();
            //return lowercase ? _String.decapitalize(label) : _String.capitalize(label);
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

function filter(filter, value, options, callback) {
    if (!_.isFunction(filter)) {
        var error = new Error('The `filter` property must be set.');

        if (_.isFunction(callback)) {
            return callback(error);
        } else {
            throw error;
        }
    }

    if (_.isUndefined(value) || _.isNull(value)) {
        if (_.isFunction(callback)) {
            return callback(null, value);
        } else {
            return value;
        }
    }

    if (_.isFunction(callback)) {
        return filter(value, options, callback);
    } else {
        return filter(value);
    }
}

function defaultValue(value, defaultValue, options, callback) {
    if (!_.isNumber(value) && _.isEmpty(value)) {
        if (_.isFunction(defaultValue)) {
            if (_.isFunction(callback)) {
                return defaultValue(value, options, callback);
            } else {
                return defaultValue();
            }
        }

        return defaultValue;
    }

    if (_.isFunction(callback)) {
        return callback(value)
    } else {
        return value;
    }
}

function requiredValidator(value, attributeLabel, options) {
    var message =  options.message || '{attribute} cannot be blank.';

    if (_.isUndefined(value)) {
        return message.replace('{attribute}', attributeLabel);
    }

    return false;
}

function rangeValidator(value, attributeLabel, options, callback) {
    if (!((_.isArray(options.range) && !_.isEmpty(options.range)) || _.isFunction(options.range))) {
        return callback(new Error('The `range` property must be set.'));
    }

    var not = !!options.not;
    var strict = !!options.strict;
    var message =  options.message || '{attribute} is invalid.';
    var range = options.range;
    var result = false;

    if (_.isFunction(options.range)) {
        options.range(value, options, function (err, _range) {
            if (err) {
                return callback(err);
            }

            if (!_.isArray(_range)) {
                return callback(new Error('The `range` property is not array.'));
            }

            range = _range;

            check();
        });
    } else {
        check();
    }

    function check () {
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
            return callback(message.replace('{attribute}', attributeLabel).replace('{range}', range.join()));
        }

        return callback();
    }
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

function compareValidator(value, attributeLabel, options, callback) {
    if (_.isUndefined(options.compareValue)) {
        return callback(new Error('The `compareValue` property must be set.'));
    }

    var compareValue = options.compareValue;
    var message =  options.message || '{attribute} is invalid.';
    var operator =  options.operator || '==';
    var result = false;

    if (_.isFunction(compareValue)) {
        compareValue(value, options, function (err, _compareValue) {
            if (err) {
                return callback(err);
            }

            compareValue = _compareValue;

            check();
        });
    } else {
        check();
    }

    function check() {
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
            return callback(message.replace('{attribute}', attributeLabel).replace('{compareValue}', compareValue));
        }

        return callback();
    }
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
    var numberMessage = options.message || '{attribute} must be a number.';
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