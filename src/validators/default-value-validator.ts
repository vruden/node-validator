import * as _ from 'lodash';
import { AbstractValidator } from './abstract-validator';

export class DefaultValueValidator extends AbstractValidator {
    static validate(value: any, defaultValue: any): any {
        if (this.isEmpty(value)) {
            return _.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }

        return value;
    }

    static isEmpty(value: any) {
        return _.isNil(value) || value === '' || ((_.isArray(value) || _.isPlainObject(value)) && _.isEmpty(value));
    }
}
