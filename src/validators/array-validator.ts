import * as _ from 'lodash';
import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IArrayValidatorOptions extends IBaseValidatorOptions {
    emptyMessage: string;
    typeMessage: string;
    notEmpty: boolean;
    type: string;
}

export class ArrayValidator extends BaseValidator {
    message: string = '{attribute} must be an array.';
    emptyMessage: string = '{attribute} must not be empty.';
    typeMessage: string = '{attribute} is not an array of {type}.';
    notEmpty: boolean = false;
    type: string;

    constructor(attributeLabel: string, value: any, options?: IArrayValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['emptyMessage', 'typeMessage', 'notEmpty', 'type']);
    }

    validate(): string | boolean {
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
            let typeFn;

            if (_.isFunction(this.type)) {
                typeFn = this.type;
            } else {
                // eslint-disable-next-line
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

    isInteger(value: any): boolean {
        return _.isNumber(value) && value % 1 === 0;
    }

    isId(value: any): boolean {
        return this.isInteger(value) && value > 0;
    }
}
