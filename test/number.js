const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('number', function () {
    describe('should work correctly', function () {
        const data = {
            numberA: 123.56,
            integerB: 123456,
            numberC: 12345.6743242,
            numberD: 0,
            numberE: 4,
            numberF: 7,
            numberG: 3,
            numberH: 5,
            numberI: 6,
            numberJ: 7,
            notNumber: '123213'
        };

        const result = {
            notNumber: [
                'Not number must be a number.'
            ],
            numberC: [
                'Number c must be an integer.'
            ],
            numberF: [
                'Number f must be no greater than 6.'
            ],
            numberG: [
                'Number g must be no less than 4.'
            ],
            numberJ: [
                'Number j must be no greater than 6.'
            ]
        };

        const rules = [
            [['numberA', 'numberD'], 'number'],
            [['integerB', 'numberC'], 'integer'],
            [['numberE', 'numberF'], 'number', {min: 4, max: 6}],
            [['numberG', 'numberH'], 'number', {min: 4}],
            [['numberI', 'numberJ'], 'number', {max: 6}],
            [['notNumber'], 'number']
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