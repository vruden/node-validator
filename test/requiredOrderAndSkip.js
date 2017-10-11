const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('requiredOrderAndSkip', function () {
    describe('should skip the validation', function () {
        const data = {
        };

        const result = {
            login: [
                'Login cannot be blank.'
            ]
        };

        const rules = [
            ['login', 'string', {min: 4}],
            ['login', 'required']
        ];

        it('aync', function () {
            const errors = validate(rules, data);

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});