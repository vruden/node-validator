"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class ArrayValidator extends base_validator_1.BaseValidator {
    message = '{attribute} must be an array.';
    emptyMessage = '{attribute} must not be empty.';
    typeMessage = '{attribute} is not an array of {type}.';
    notEmpty = false;
    type;
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return super.getOptionNameList(...childrenList, ['emptyMessage', 'typeMessage', 'notEmpty', 'type']);
    }
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        if (!_.isArray(this.value)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        if (this.notEmpty && _.isEmpty(this.value)) {
            return this.emptyMessage.replace('{attribute}', this.attributeLabel);
        }
        if (this.type) {
            let typeFn = undefined;
            if (_.isFunction(this.type)) {
                typeFn = this.type;
            }
            else {
                switch (this.type) {
                    case 'string':
                        typeFn = _.isString;
                        break;
                    case 'number':
                        typeFn = _.isNumber;
                        break;
                    case 'integer':
                        typeFn = this.isInteger.bind(this);
                        break;
                    case 'id':
                        typeFn = this.isId.bind(this);
                        break;
                }
            }
            if (_.isUndefined(typeFn)) {
                throw new Error('The `type` property is wrong.');
            }
            let isValid = true;
            for (const i of this.value) {
                if (!typeFn(i)) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                return this.typeMessage.replace('{attribute}', this.attributeLabel).replace('{type}', this.type);
            }
        }
        return false;
    }
    isInteger(value) {
        return _.isNumber(value) && value % 1 === 0;
    }
    isId(value) {
        return this.isInteger(value) && value > 0;
    }
}
exports.ArrayValidator = ArrayValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRvcnMvYXJyYXktdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRCQUE0QjtBQUM1QixxREFBd0U7QUFTeEUsTUFBYSxjQUFlLFNBQVEsOEJBQWE7SUFDN0MsT0FBTyxHQUFXLCtCQUErQixDQUFDO0lBQ2xELFlBQVksR0FBVyxnQ0FBZ0MsQ0FBQztJQUN4RCxXQUFXLEdBQVcsd0NBQXdDLENBQUM7SUFDL0QsUUFBUSxHQUFZLEtBQUssQ0FBQztJQUMxQixJQUFJLENBQVM7SUFFYixZQUFZLGNBQXNCLEVBQUUsS0FBVSxFQUFFLE9BQWdDO1FBQzVFLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGlCQUFpQixDQUFDLEdBQUcsWUFBd0I7UUFDbkQsT0FBTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUM7WUFDbkMsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDekMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUV2QixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQzFCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLENBQUM7aUJBQU0sQ0FBQztnQkFDSixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsS0FBSyxRQUFRO3dCQUNULE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO3dCQUNwQixNQUFNO29CQUNWLEtBQUssUUFBUTt3QkFDVCxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDcEIsTUFBTTtvQkFDVixLQUFLLFNBQVM7d0JBQ1YsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNuQyxNQUFNO29CQUNWLEtBQUssSUFBSTt3QkFDTCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzlCLE1BQU07Z0JBQ2QsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFFbkIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDYixPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUNoQixNQUFNO2dCQUNWLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRyxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBVTtRQUNoQixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFVO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNKO0FBaEZELHdDQWdGQyJ9