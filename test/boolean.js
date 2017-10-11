const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('boolean', function () {
    describe('should work correctly', function () {
        const data = {
            active : 1,
            has_error: 0,
            has_child: false
        };

        const result = {
            active: [
                'Active is not boolean.'
            ]
        };

        const rules = [
            [['active'], 'boolean', {strict: true}],
            ['has_error', 'boolean'],
            ['has_child', 'boolean']
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