"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularExpressionValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class RegularExpressionValidator extends base_validator_1.BaseValidator {
    message = '{attribute} is invalid.';
    pattern;
    not = false;
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.setOptions(options);
        if (_.isNil(this.pattern) || !_.isRegExp(this.pattern)) {
            throw new Error('The `pattern` property must be set.');
        }
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['pattern', 'not']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let result = this.pattern.test(this.value);
        if (this.not) {
            result = !result;
        }
        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.RegularExpressionValidator = RegularExpressionValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVndWxhci1leHByZXNzaW9uLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3JzL3JlZ3VsYXItZXhwcmVzc2lvbi12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLHFEQUF3RTtBQU94RSxNQUFhLDBCQUEyQixTQUFRLDhCQUFhO0lBQ3pELE9BQU8sR0FBVyx5QkFBeUIsQ0FBQztJQUM1QyxPQUFPLENBQUM7SUFDUixHQUFHLEdBQVksS0FBSyxDQUFDO0lBRXJCLFlBQVksY0FBc0IsRUFBRSxLQUFVLEVBQUUsT0FBNEM7UUFDeEYsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDM0QsQ0FBQztJQUNMLENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxHQUFHLFlBQXdCO1FBQ25ELE9BQU8sS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBSSxNQUFNLEdBQVMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDVixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSjtBQW5DRCxnRUFtQ0MifQ==