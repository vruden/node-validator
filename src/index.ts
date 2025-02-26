import * as _ from 'lodash';

import { FilterValidator } from './validators/filter-validator';
import { AsyncFilterValidator } from './validators/async-filter-validator';
import { DefaultValueValidator } from './validators/default-value-validator';
import { AsyncDefaultValueValidator } from './validators/async-default-value-validator';
import { RequiredValidator } from './validators/required-validator';
import { ArrayValidator } from './validators/array-validator';
import { BooleanValidator } from './validators/boolean-validator';
import { CompareValidator } from './validators/compare-validator';
import { AsyncCompareValidator } from './validators/async-compare-validator';
import { NumberValidator } from './validators/number-validator';
import { EmailValidator } from './validators/email-validator';
import { RangeValidator } from './validators/range-validator';
import { AsyncRangeValidator } from './validators/async-range-validator';
import { RegularExpressionValidator } from './validators/regular-expression-validator';
import { StringValidator } from './validators/string-validator';

export { validate } from './validator';

export { validate as asyncValidate } from './async-validator';

export const filter = FilterValidator.validate;

export const asyncFilter = AsyncFilterValidator.validate;

export const setDefaultValue = DefaultValueValidator.validate;

export const asyncSetDefaultValue = AsyncDefaultValueValidator.validate;

export const checkRequiredValue: (value: any, variableName?: any, options?: any) => string | boolean =
    RequiredValidator.validateValue;

export const checkArray: (value: any, variableName?: any, options?: any) => string | boolean =
    ArrayValidator.validateValue;

export const checkBoolean: (value: any, variableName?: any, options?: any) => string | boolean =
    BooleanValidator.validateValue;

export const compare: (value: any, variableName?: any, options?: any) => string | boolean =
    CompareValidator.validateValue;

export const asyncCompare: (value: any, variableName?: any, options?: any) => Promise<string | boolean> =
    AsyncCompareValidator.validateValue;

export const checkNumber: (value: any, variableName?: any, options?: any) => string | boolean =
    NumberValidator.validateValue;

export const checkEmail: (value: any, variableName?: any, options?: any) => string | boolean =
    EmailValidator.validateValue;

export const checkInRange: (value: any, variableName?: any, options?: any) => string | boolean =
    RangeValidator.validateValue;

export const asyncCheckInRange: (value: any, variableName?: any, options?: any) => Promise<string | boolean> =
    AsyncRangeValidator.validateValue;

export const match: (value: any, variableName?: any, options?: any) => string | boolean =
    RegularExpressionValidator.validateValue;

export const checkString: (value: any, variableName?: any, options?: any) => string | boolean =
    StringValidator.validateValue;

// eslint-disable-next-line func-names
export const checkInteger = function (value: any, variableName?: any, options?: any) {
    options = options || {};

    if (_.isPlainObject(variableName)) {
        options = variableName;
        variableName = undefined;
    }

    options = _.extend(options, {
        integerOnly: true
    });

    return NumberValidator.validateValue(value, variableName, options);
};

// eslint-disable-next-line func-names
export const checkId = function (value: any, variableName?: any, options?: any) {
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

    return NumberValidator.validateValue(value, variableName, options);
};
