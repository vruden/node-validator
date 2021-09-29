const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('string', function () {
    describe('should work correctly', function () {
        const data = {
            stringA: '123213',
            stringB: '123456',
            stringB1: '123456',
            stringC: '1234567',
            stringD: '123',
            stringE: '1234',
            stringF: '1234567890',
            stringG: '',
            notString: 2222
        };

        const result = {
            notString: [
                'Not string must be a string.'
            ],
            stringB: [
                'String b should contain at most 4 characters.'
            ],
            stringB1: [
                'String b1 too long.'
            ],
            stringC: [
                'String c should contain 6 characters.'
            ],
            stringD: [
                'String d should contain at least 4 characters.'
            ],
            stringF: [
                'String f should contain at most 6 characters.'
            ]
        };

        const rules = [
            [['stringA', 'notString'], 'string'],
            [['stringC'], 'string', {length: 6}],
            [['stringB1'], 'string', {max: 4, tooLong: '{attribute} too long.'}],
            [['stringB'], 'string', {length: [2,4]}],
            [['stringD', 'stringE', 'stringF'], 'string', {min: 4, max: 6}],
            [['stringG'], 'string']
        ];

        it('async', function () {
            const errors = validate(rules, data);

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});
