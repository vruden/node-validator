const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('required', function () {
    describe('should set default values', function () {
        const data = {
            first_name: 'Tom',
            age: null,
            second_name: null,
            range1: [],
            range2: [],
            string1: '   ',
            string2: '   '
        };

        const result = {
            age : [
                'Возраст cannot be blank.'
            ],
            range1: [
                'Range1 cannot be blank.'
            ],
            string1: [
                'String1 cannot be blank.'
            ],
            parents: [
                'Field parents cannot be blank.'
            ]
        };

        const rules = [
            [['age', 'first_name', 'range1', 'string1'], 'required'],
            [['second_name', 'range2', 'string2'], 'required', {strict: true}],
            [['parents'], 'required', {message: 'Field {attribute} cannot be blank.', lowercaseLabel: true}]
        ];

        it('sync', async function () {
            const errors = validate(rules, data, {age: 'Возраст'});

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data, {age: 'Возраст'});

            assert.deepEqual(result, errors);
        });
    });
});
