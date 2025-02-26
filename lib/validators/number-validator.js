"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class NumberValidator extends base_validator_1.BaseValidator {
    integerMessage = '{attribute} must be an integer.';
    numberMessage = '{attribute} must be a number.';
    tooSmall = '{attribute} must be no less than {min}.';
    tooBig = '{attribute} must be no greater than {max}.';
    integerOnly = false;
    min;
    max;
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.setOptions(options);
        if (!this.message) {
            this.message = this.integerOnly ? this.integerMessage : this.numberMessage;
        }
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['tooSmall', 'tooBig', 'integerOnly', 'min', 'max']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        if (!_.isNumber(this.value) || (this.integerOnly && !this.isInteger(this.value))) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        if (this.min && this.value < this.min) {
            return this.tooSmall.replace('{attribute}', this.attributeLabel).replace('{min}', this.min.toString());
        }
        if (this.max && this.value > this.max) {
            return this.tooBig.replace('{attribute}', this.attributeLabel).replace('{max}', this.max.toString());
        }
        return false;
    }
    isInteger(value) {
        return _.isNumber(value) && value % 1 === 0;
    }
}
exports.NumberValidator = NumberValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3JzL251bWJlci12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLHFEQUF3RTtBQVV4RSxNQUFhLGVBQWdCLFNBQVEsOEJBQWE7SUFDOUMsY0FBYyxHQUFXLGlDQUFpQyxDQUFDO0lBQzNELGFBQWEsR0FBVywrQkFBK0IsQ0FBQztJQUN4RCxRQUFRLEdBQVcseUNBQXlDLENBQUM7SUFDN0QsTUFBTSxHQUFXLDRDQUE0QyxDQUFDO0lBQzlELFdBQVcsR0FBWSxLQUFLLENBQUM7SUFDN0IsR0FBRyxDQUFTO0lBQ1osR0FBRyxDQUFTO0lBRVosWUFBWSxjQUFzQixFQUFFLEtBQVUsRUFBRSxPQUFpQztRQUM3RSxLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQy9FLENBQUM7SUFDTCxDQUFDO0lBRVMsaUJBQWlCLENBQUMsR0FBRyxZQUF3QjtRQUNuRCxPQUFPLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUM7WUFDbkMsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDL0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDcEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzNHLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDcEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pHLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWE7UUFDbkIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDSjtBQTlDRCwwQ0E4Q0MifQ==