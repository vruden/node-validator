const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('email', function () {
    describe('should work correctly', function () {
        const data = {
            emailA : 123213,
            emailB: 'test',
            emailC: 'test@pantryretail.com'
        };

        const result = {
            emailA: [
                'Email a is not a valid email address.'
            ],
            emailB: [
                'Email b is not a valid email address.'
            ]
        };

        const rules = [
            ['emailA', 'email'],
            ['emailB', 'email'],
            ['emailC', 'email']
        ];

        it('sync', async function () {
            const errors = validate(rules, data);

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});