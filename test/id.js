const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('id', function () {
    describe('should work correctly', function () {
        const data = {
            role_id : 5,
            group_id: '12',
            campus_id: 0
        };

        const result = {
            group_id: [
                'Group must be an integer.'
            ],
            campus_id: [
                'Campus must be correct id.'
            ]
        };

        const rules = [
            [['role_id', 'group_id', 'campus_id'], 'id']
        ];

        it('sync', function () {
            const errors = validate(rules, data);

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});