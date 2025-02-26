"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = exports.checkInteger = exports.checkString = exports.match = exports.asyncCheckInRange = exports.checkInRange = exports.checkEmail = exports.checkNumber = exports.asyncCompare = exports.compare = exports.checkBoolean = exports.checkArray = exports.checkRequiredValue = exports.asyncSetDefaultValue = exports.setDefaultValue = exports.asyncFilter = exports.filter = exports.asyncValidate = exports.validate = void 0;
const _ = require("lodash");
const filter_validator_1 = require("./validators/filter-validator");
const async_filter_validator_1 = require("./validators/async-filter-validator");
const default_value_validator_1 = require("./validators/default-value-validator");
const async_default_value_validator_1 = require("./validators/async-default-value-validator");
const required_validator_1 = require("./validators/required-validator");
const array_validator_1 = require("./validators/array-validator");
const boolean_validator_1 = require("./validators/boolean-validator");
const compare_validator_1 = require("./validators/compare-validator");
const async_compare_validator_1 = require("./validators/async-compare-validator");
const number_validator_1 = require("./validators/number-validator");
const email_validator_1 = require("./validators/email-validator");
const range_validator_1 = require("./validators/range-validator");
const async_range_validator_1 = require("./validators/async-range-validator");
const regular_expression_validator_1 = require("./validators/regular-expression-validator");
const string_validator_1 = require("./validators/string-validator");
var validator_1 = require("./validator");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validator_1.validate; } });
var async_validator_1 = require("./async-validator");
Object.defineProperty(exports, "asyncValidate", { enumerable: true, get: function () { return async_validator_1.validate; } });
exports.filter = filter_validator_1.FilterValidator.validate;
exports.asyncFilter = async_filter_validator_1.AsyncFilterValidator.validate;
exports.setDefaultValue = default_value_validator_1.DefaultValueValidator.validate;
exports.asyncSetDefaultValue = async_default_value_validator_1.AsyncDefaultValueValidator.validate;
exports.checkRequiredValue = required_validator_1.RequiredValidator.validateValue;
exports.checkArray = array_validator_1.ArrayValidator.validateValue;
exports.checkBoolean = boolean_validator_1.BooleanValidator.validateValue;
exports.compare = compare_validator_1.CompareValidator.validateValue;
exports.asyncCompare = async_compare_validator_1.AsyncCompareValidator.validateValue;
exports.checkNumber = number_validator_1.NumberValidator.validateValue;
exports.checkEmail = email_validator_1.EmailValidator.validateValue;
exports.checkInRange = range_validator_1.RangeValidator.validateValue;
exports.asyncCheckInRange = async_range_validator_1.AsyncRangeValidator.validateValue;
exports.match = regular_expression_validator_1.RegularExpressionValidator.validateValue;
exports.checkString = string_validator_1.StringValidator.validateValue;
const checkInteger = function (value, variableName, options) {
    options = options || {};
    if (_.isPlainObject(variableName)) {
        options = variableName;
        variableName = undefined;
    }
    options = _.extend(options, {
        integerOnly: true
    });
    return number_validator_1.NumberValidator.validateValue(value, variableName, options);
};
exports.checkInteger = checkInteger;
const checkId = function (value, variableName, options) {
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
    return number_validator_1.NumberValidator.validateValue(value, variableName, options);
};
exports.checkId = checkId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBRTVCLG9FQUFnRTtBQUNoRSxnRkFBMkU7QUFDM0Usa0ZBQTZFO0FBQzdFLDhGQUF3RjtBQUN4Rix3RUFBb0U7QUFDcEUsa0VBQThEO0FBQzlELHNFQUFrRTtBQUNsRSxzRUFBa0U7QUFDbEUsa0ZBQTZFO0FBQzdFLG9FQUFnRTtBQUNoRSxrRUFBOEQ7QUFDOUQsa0VBQThEO0FBQzlELDhFQUF5RTtBQUN6RSw0RkFBdUY7QUFDdkYsb0VBQWdFO0FBRWhFLHlDQUF1QztBQUE5QixxR0FBQSxRQUFRLE9BQUE7QUFDakIscURBQThEO0FBQXJELGdIQUFBLFFBQVEsT0FBaUI7QUFFckIsUUFBQSxNQUFNLEdBQUcsa0NBQWUsQ0FBQyxRQUFRLENBQUM7QUFDbEMsUUFBQSxXQUFXLEdBQUcsNkNBQW9CLENBQUMsUUFBUSxDQUFDO0FBQzVDLFFBQUEsZUFBZSxHQUFHLCtDQUFxQixDQUFDLFFBQVEsQ0FBQztBQUNqRCxRQUFBLG9CQUFvQixHQUFHLDBEQUEwQixDQUFDLFFBQVEsQ0FBQztBQUMzRCxRQUFBLGtCQUFrQixHQUF3RSxzQ0FBaUIsQ0FBQyxhQUFhLENBQUM7QUFDMUgsUUFBQSxVQUFVLEdBQXdFLGdDQUFjLENBQUMsYUFBYSxDQUFDO0FBQy9HLFFBQUEsWUFBWSxHQUF3RSxvQ0FBZ0IsQ0FBQyxhQUFhLENBQUM7QUFDbkgsUUFBQSxPQUFPLEdBQXdFLG9DQUFnQixDQUFDLGFBQWEsQ0FBQztBQUM5RyxRQUFBLFlBQVksR0FBaUYsK0NBQXFCLENBQUMsYUFBYSxDQUFDO0FBQ2pJLFFBQUEsV0FBVyxHQUF3RSxrQ0FBZSxDQUFDLGFBQWEsQ0FBQztBQUNqSCxRQUFBLFVBQVUsR0FBd0UsZ0NBQWMsQ0FBQyxhQUFhLENBQUM7QUFDL0csUUFBQSxZQUFZLEdBQXdFLGdDQUFjLENBQUMsYUFBYSxDQUFDO0FBQ2pILFFBQUEsaUJBQWlCLEdBQWlGLDJDQUFtQixDQUFDLGFBQWEsQ0FBQztBQUNwSSxRQUFBLEtBQUssR0FBd0UseURBQTBCLENBQUMsYUFBYSxDQUFDO0FBQ3RILFFBQUEsV0FBVyxHQUF3RSxrQ0FBZSxDQUFDLGFBQWEsQ0FBQztBQUV2SCxNQUFNLFlBQVksR0FBRyxVQUFVLEtBQVUsRUFBRSxZQUFrQixFQUFFLE9BQWE7SUFDL0UsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFFeEIsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7UUFDaEMsT0FBTyxHQUFHLFlBQVksQ0FBQztRQUN2QixZQUFZLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDeEIsV0FBVyxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxrQ0FBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZFLENBQUMsQ0FBQztBQWJXLFFBQUEsWUFBWSxnQkFhdkI7QUFFSyxNQUFNLE9BQU8sR0FBRyxVQUFVLEtBQVUsRUFBRSxZQUFrQixFQUFFLE9BQWE7SUFDMUUsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFFeEIsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7UUFDaEMsT0FBTyxHQUFHLFlBQVksQ0FBQztRQUN2QixZQUFZLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDeEIsV0FBVyxFQUFFLElBQUk7UUFDakIsR0FBRyxFQUFFLENBQUM7UUFDTixRQUFRLEVBQUUsaUNBQWlDO0tBQzlDLENBQUMsQ0FBQztJQUVILE9BQU8sa0NBQWUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUM7QUFmVyxRQUFBLE9BQU8sV0FlbEIifQ==