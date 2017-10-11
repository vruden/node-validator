const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('skipOnError', function () {
    describe('should skip the validation', function () {
        const data = {
            login: 'mylogin',
            password: 'mypass2'
        };

        const result = {
            login: [
                'Login should contain at least 8 characters.',
                'Login must contain at least one number.'
            ],
            password: [
                'Password should contain at least 8 characters.'
            ]
        };

        const rules = [
            [['login', 'password'], 'string', {min: 8}],
            ['password', isContainNumber],
            ['login', isContainNumber, {skipOnError: false}]
        ];

        function isContainNumber(value, attributeLabel, options) {
            return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
        }

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