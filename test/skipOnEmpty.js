const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('skipOnEmpty', function () {
    describe('should skip the validation', function () {
        const data = {
            login: null,
            age: '',
            roles: [],
            notes: {},
            id: 4
        };

        const result = {
            id: [
                'Id must be no less than 5.'
            ],
            login: [
                'Login must be a string.'
            ],
            password: [
                'Password must be a number.'
            ]
        };

        const rules = [
            ['id', 'number', {min: 5}],
            [['age', 'roles', 'notes'], 'number'],
            ['login', 'string', {skipOnEmpty: false}],
            ['password', 'number', {skipOnEmpty: false}]
        ];

        it('sync', function () {
            const errors = validate(rules, data);

            assert.deepEqual(errors, result);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data);

            assert.deepEqual(errors, result);
        });
    });
});