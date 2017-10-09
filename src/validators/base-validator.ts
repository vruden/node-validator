import * as _ from 'lodash';
import { AbstractValidator } from './abstract-validator';

export interface IBaseValidatorOptions {
    message?: string;
    skipOnEmpty?: boolean;
}

export interface IBaseValidator {
    validate(): boolean | string;
}

export class BaseValidator extends AbstractValidator implements IBaseValidator {
    public message: string;
    public skipOnEmpty: boolean = false;

    constructor(protected attributeLabel: string, protected value, options?: IBaseValidatorOptions) {
        super();
        this.setOptions(options);
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return _.uniq(_.union(_.flatten(childrenList), ['message', 'skipOnEmpty']));
    }

    protected setOptions(options) {
        if (options) {

            options = _.pick(options, this.getOptionNameList());

            Object.assign(this, options);
        }
    }

    isAvailableForValidation(): boolean {
        if (this.skipOnEmpty && (this.constructor as typeof BaseValidator).isEmptyValue(this.value)) {
            return false;
        }

        return true;
    }

    validate(): boolean | string {
        return false;
    }

    static isEmptyValue(value): boolean {
        const isEmptyString = _.isString(value) && _.isEmpty(value);
        const isEmptyArray = _.isArray(value) && _.isEmpty(value);

        return _.isNil(value) || isEmptyString || isEmptyArray;
    }

    static validateValue(value, variableName?, options?): boolean | string {
        let _variableName = 'Variable';
        let _options = options || {};

        if (_.isPlainObject(variableName)) {
            _options = variableName;
        } else if (_.isString(variableName)) {
            _variableName = variableName;
        }

        const validator = new this(_variableName, value, _options);

        return validator.validate();
    }
}