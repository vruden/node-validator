"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValidator = void 0;
const _ = require("lodash");
const abstract_validator_1 = require("./abstract-validator");
class BaseValidator extends abstract_validator_1.AbstractValidator {
    attributeLabel;
    value;
    message;
    skipOnEmpty = true;
    constructor(attributeLabel, value, options) {
        super();
        this.attributeLabel = attributeLabel;
        this.value = value;
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return _.uniq(_.union(_.flatten(childrenList), ['message', 'skipOnEmpty']));
    }
    setOptions(options) {
        if (options) {
            options = _.pick(options, this.getOptionNameList());
            Object.assign(this, options);
        }
    }
    isAvailableForValidation() {
        if (this.skipOnEmpty && this.constructor.isEmptyValue(this.value)) {
            return false;
        }
        return true;
    }
    validate() {
        return false;
    }
    static isEmptyValue(value) {
        const isEmptyString = _.isString(value) && value.length === 0;
        const isEmptyArray = _.isArray(value) && _.isEmpty(value);
        const isEmptyObject = _.isPlainObject(value) && _.isEmpty(value);
        return _.isNil(value) || isEmptyString || isEmptyArray || isEmptyObject;
    }
    static validateValue(value, variableName, options) {
        let _variableName = 'Variable';
        let _options = options || {};
        if (_.isPlainObject(variableName)) {
            _options = variableName;
        }
        else if (_.isString(variableName)) {
            _variableName = variableName;
        }
        const validator = new this(_variableName, value, _options);
        return validator.validate();
    }
}
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsaWRhdG9ycy9iYXNlLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBNEI7QUFDNUIsNkRBQXlEO0FBV3pELE1BQWEsYUFBYyxTQUFRLHNDQUFpQjtJQUkxQjtJQUFrQztJQUhqRCxPQUFPLENBQVM7SUFDaEIsV0FBVyxHQUFZLElBQUksQ0FBQztJQUVuQyxZQUFzQixjQUFzQixFQUFZLEtBQVUsRUFBRSxPQUErQjtRQUMvRixLQUFLLEVBQUUsQ0FBQztRQURVLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQVksVUFBSyxHQUFMLEtBQUssQ0FBSztRQUU5RCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxHQUFHLFlBQXdCO1FBQ25ELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFUyxVQUFVLENBQUMsT0FBWTtRQUM3QixJQUFJLE9BQU8sRUFBRSxDQUFDO1lBRVYsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFFcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUM7SUFFRCx3QkFBd0I7UUFDcEIsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFLLElBQUksQ0FBQyxXQUFvQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMxRixPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFVO1FBQzFCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFDOUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVqRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksYUFBYSxJQUFJLFlBQVksSUFBSSxhQUFhLENBQUM7SUFDNUUsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBVSxFQUFFLFlBQWtCLEVBQUUsT0FBYTtRQUM5RCxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNoQyxRQUFRLEdBQUcsWUFBWSxDQUFDO1FBQzVCLENBQUM7YUFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNsQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTNELE9BQU8sU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQXhERCxzQ0F3REMifQ==