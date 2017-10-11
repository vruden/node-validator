const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('required', function () {
    describe('should set default values', function () {
        const data = {
            first_name: 'Tom'
        };

        const result = {
            age : [
                'Возраст cannot be blank.'
            ],
            second_name: [
                'Second name cannot be blank.'
            ],
            parents: [
                'Field parents cannot be blank.'
            ]
        };

        const rules = [
            [['age', 'first_name', 'second_name'], 'required'],
            [['parents'], 'required', {message: 'Field {attribute} cannot be blank.', lowercaseLabel: true}]
        ];

        it('sync', async function () {
            validate(rules, data, {age: 'Возраст'});

            assert.deepEqual(result, result);
        });

        it('async', async function () {
            await asyncValidate(rules, data, {age: 'Возраст'});

            assert.deepEqual(result, result);
        });
    });
});