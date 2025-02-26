"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterValidator = void 0;
const _ = require("lodash");
const abstract_validator_1 = require("./abstract-validator");
class FilterValidator extends abstract_validator_1.AbstractValidator {
    static validate(filter, value) {
        if (!_.isFunction(filter)) {
            throw new Error('The `filter` property must be set.');
        }
        if (_.isNil(value)) {
            return value;
        }
        return filter(value);
    }
}
exports.FilterValidator = FilterValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3JzL2ZpbHRlci12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLDZEQUF5RDtBQUV6RCxNQUFhLGVBQWdCLFNBQVEsc0NBQWlCO0lBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBVyxFQUFFLEtBQVU7UUFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDO0NBQ0o7QUFaRCwwQ0FZQyJ9