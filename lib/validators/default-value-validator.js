"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultValueValidator = void 0;
const _ = require("lodash");
const abstract_validator_1 = require("./abstract-validator");
class DefaultValueValidator extends abstract_validator_1.AbstractValidator {
    static validate(value, defaultValue) {
        if (this.isEmpty(value)) {
            return _.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }
        return value;
    }
    static isEmpty(value) {
        return _.isNil(value) || value === '' || ((_.isArray(value) || _.isPlainObject(value)) && _.isEmpty(value));
    }
}
exports.DefaultValueValidator = DefaultValueValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC12YWx1ZS12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsaWRhdG9ycy9kZWZhdWx0LXZhbHVlLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBNEI7QUFDNUIsNkRBQXlEO0FBRXpELE1BQWEscUJBQXNCLFNBQVEsc0NBQWlCO0lBQ3hELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBVSxFQUFFLFlBQWlCO1FBQ3pDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUN0RSxDQUFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBVTtRQUNyQixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hILENBQUM7Q0FDSjtBQVpELHNEQVlDIn0=