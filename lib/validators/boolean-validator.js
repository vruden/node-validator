"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanValidator = void 0;
const base_validator_1 = require("./base-validator");
class BooleanValidator extends base_validator_1.BaseValidator {
    message = '{attribute} is not boolean.';
    strict = false;
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['strict']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let result = false;
        if (this.strict) {
            result = this.value === true || this.value === false;
        }
        else {
            result = this.value == true || this.value == false;
        }
        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.BooleanValidator = BooleanValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhbi12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsaWRhdG9ycy9ib29sZWFuLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBd0U7QUFNeEUsTUFBYSxnQkFBaUIsU0FBUSw4QkFBYTtJQUMvQyxPQUFPLEdBQVcsNkJBQTZCLENBQUM7SUFDaEQsTUFBTSxHQUFZLEtBQUssQ0FBQztJQUV4QixZQUFZLGNBQXNCLEVBQUUsS0FBVSxFQUFFLE9BQWtDO1FBQzlFLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGlCQUFpQixDQUFDLEdBQUcsWUFBd0I7UUFDbkQsT0FBTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUM7WUFDbkMsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztRQUN6RCxDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQztRQUN2RCxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBQ0o7QUFqQ0QsNENBaUNDIn0=