import * as _ from 'lodash';
import { AbstractValidator } from './abstract-validator';

export class AsyncDefaultValueValidator extends AbstractValidator {
    static async validate(value, defaultValue): Promise<any> {
        if (this.isEmpty(value)) {
            return _.isFunction(defaultValue) ? await defaultValue() : defaultValue;
        }

        return value;
    }

    static isEmpty(value) {
        return _.isNil(value) || value === '' || ((_.isArray(value) || _.isPlainObject(value)) && _.isEmpty(value));
    }
}