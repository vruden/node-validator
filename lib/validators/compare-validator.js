"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareValidator = void 0;
const _ = require("lodash");
const base_compare_validator_1 = require("./base-compare-validator");
class CompareValidator extends base_compare_validator_1.BaseCompareValidator {
    validate() {
        if (!this.isAvailableForValidation()) {
            return false;
        }
        let compareValue = this.compareValue;
        if (_.isFunction(this.compareValue)) {
            compareValue = this.compareValue();
        }
        if (!this.copmare(compareValue)) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }
        return false;
    }
}
exports.CompareValidator = CompareValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFyZS12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsaWRhdG9ycy9jb21wYXJlLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBNEI7QUFDNUIscUVBQWdFO0FBRWhFLE1BQWEsZ0JBQWlCLFNBQVEsNkNBQW9CO0lBQ3RELFFBQVE7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUVyQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7WUFDbEMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2QyxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSjtBQWxCRCw0Q0FrQkMifQ==