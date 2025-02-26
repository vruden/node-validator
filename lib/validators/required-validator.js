"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class RequiredValidator extends base_validator_1.BaseValidator {
    message = '{attribute} cannot be blank.';
    strict = false;
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['strict']);
    }
    validate() {
        if ((this.strict && _.isUndefined(this.value)) || (!this.strict && this.constructor.isEmptyValue(_.isString(this.value) ? _.trim(this.value) : this.value))) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.RequiredValidator = RequiredValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZWQtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRvcnMvcmVxdWlyZWQtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRCQUE0QjtBQUM1QixxREFBd0U7QUFFeEUsTUFBYSxpQkFBa0IsU0FBUSw4QkFBYTtJQUNoRCxPQUFPLEdBQVcsOEJBQThCLENBQUM7SUFDakQsTUFBTSxHQUFZLEtBQUssQ0FBQztJQUV4QixZQUFZLGNBQXNCLEVBQUUsS0FBVSxFQUFFLE9BQStCO1FBQzNFLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGlCQUFpQixDQUFDLEdBQUcsWUFBd0I7UUFDbkQsT0FBTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSyxJQUFJLENBQUMsV0FBb0MsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3BMLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBckJELDhDQXFCQyJ9