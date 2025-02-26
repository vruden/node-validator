"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class StringValidator extends base_validator_1.BaseValidator {
    message = '{attribute} must be a string.';
    tooShort = '{attribute} should contain at least {min} characters.';
    tooLong = '{attribute} should contain at most {max} characters.';
    notEqual = '{attribute} should contain {length} characters.';
    length;
    min;
    max;
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        // console.log('sttttriiing', options.length)
        this.setOptions(options);
        // console.log(options.length)
        if (_.isArray(this.length)) {
            if (this.length[0]) {
                this.min = this.length[0];
            }
            if (this.length[1]) {
                this.max = this.length[1];
            }
            this.length = undefined;
        }
        // console.log(this.length)
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['tooShort', 'tooLong', 'notEqual', 'length', 'min', 'max']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        if (!_.isString(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        const length = this.value.length;
        if (this.length && this.length !== length) {
            return this.notEqual.replace('{attribute}', this.attributeLabel).replace('{length}', this.length.toString());
        }
        else {
            if (this.min && this.min > length) {
                return this.tooShort.replace('{attribute}', this.attributeLabel).replace('{min}', this.min.toString());
            }
            if (this.max && this.max < length) {
                return this.tooLong.replace('{attribute}', this.attributeLabel).replace('{max}', this.max.toString());
            }
        }
        return false;
    }
}
exports.StringValidator = StringValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3JzL3N0cmluZy12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLHFEQUF3RTtBQVd4RSxNQUFhLGVBQWdCLFNBQVEsOEJBQWE7SUFDOUMsT0FBTyxHQUFXLCtCQUErQixDQUFDO0lBQ2xELFFBQVEsR0FBVyx1REFBdUQsQ0FBQztJQUMzRSxPQUFPLEdBQVcsc0RBQXNELENBQUM7SUFDekUsUUFBUSxHQUFXLGlEQUFpRCxDQUFDO0lBQ3JFLE1BQU0sQ0FBVTtJQUNoQixHQUFHLENBQVU7SUFDYixHQUFHLENBQVU7SUFFYixZQUFZLGNBQXNCLEVBQUUsS0FBVSxFQUFFLE9BQWlDO1FBQzdFLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpCLDhCQUE4QjtRQUU5QixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDNUIsQ0FBQztRQUVELDJCQUEyQjtJQUMvQixDQUFDO0lBRVMsaUJBQWlCLENBQUMsR0FBRyxZQUF3QjtRQUNuRCxPQUFPLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqSCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDO1lBQ25DLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRWpDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNqSCxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sRUFBRSxDQUFDO2dCQUNoQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0csQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sRUFBRSxDQUFDO2dCQUNoQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUcsQ0FBQztRQUNMLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBQ0o7QUE3REQsMENBNkRDIn0=