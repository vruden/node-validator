import * as _ from 'lodash';
import { AbstractValidator } from './abstract-validator';

export class AsyncDefaultValueValidator extends AbstractValidator {
    static async validate(value: any, defaultValue: any): Promise<any> {
        if (this.isEmpty(value)) {
            return _.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }

        return value;
    }

    static isEmpty(value: any) {
        return _.isNil(value) || value === '' || ((_.isArray(value) || _.isPlainObject(value)) && _.isEmpty(value));
    }
}
