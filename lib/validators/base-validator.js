"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const abstract_validator_1 = require("./abstract-validator");
class BaseValidator extends abstract_validator_1.AbstractValidator {
    constructor(attributeLabel, value, options) {
        super();
        this.attributeLabel = attributeLabel;
        this.value = value;
        this.skipOnEmpty = false;
        this.setOptions(options);
    }
    getOptionNameList(...childrenList) {
        return _.uniq(_.union(_.flatten(childrenList), ['message', 'skipOnEmpty']));
    }
    setOptions(options) {
        if (options) {
            options = _.pick(options, this.getOptionNameList());
            _.forOwn(options, (value, key) => {
                this[key] = value;
            });
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
        const isEmptyString = _.isString(value) && _.isEmpty(value);
        const isEmptyArray = _.isArray(value) && _.isEmpty(value);
        return _.isNil(value) || isEmptyString || isEmptyArray;
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
//# sourceMappingURL=base-validator.js.map