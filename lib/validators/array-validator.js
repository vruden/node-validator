"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayValidator = void 0;
const _ = require("lodash");
const base_validator_1 = require("./base-validator");
class ArrayValidator extends base_validator_1.BaseValidator {
    constructor(attributeLabel, value, options) {
        super(attributeLabel, value, options);
        this.message = '{attribute} must be an array.';
        this.emptyMessage = '{attribute} must not be empty.';
        this.typeMessage = '{attribute} is not an array of {type}.';
        this.notEmpty = false;
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
