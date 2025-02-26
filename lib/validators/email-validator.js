"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class EmailValidator extends base_validator_1.BaseValidator {
    pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    message = '{attribute} is not a valid email address.';
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, []);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        if (!_.isString(this.value) || this.value.length > 320 || !this.pattern.test(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.EmailValidator = EmailValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRvcnMvZW1haWwtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRCQUE0QjtBQUM1QixxREFBd0U7QUFFeEUsTUFBYSxjQUFlLFNBQVEsOEJBQWE7SUFDN0MsT0FBTyxHQUFHLDJKQUEySixDQUFDO0lBQ3RLLE9BQU8sR0FBVywyQ0FBMkMsQ0FBQztJQUU5RCxZQUFZLGNBQXNCLEVBQUUsS0FBVSxFQUFFLE9BQStCO1FBQzNFLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGlCQUFpQixDQUFDLEdBQUcsWUFBd0I7UUFDbkQsT0FBTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3ZGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBekJELHdDQXlCQyJ9