import * as _ from 'lodash';
import { AbstractValidator } from './abstract-validator';

export class AsyncFilterValidator extends AbstractValidator {
    static async validate(filter, value): Promise<any> {
        if (!_.isFunction(filter)) {
            throw new Error('The `filter` property must be set.');
        }

        if (_.isNil(value)) {
            return value;
        }

        return await filter(value);
    }
}