const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('order', function () {
    describe('should work correctly', function () {
        const _data = {
            login: '',
            name: ' Tomas ',
            age: 17,
            role_id: null,
            date: '12.15.2015',
            password: 'qwerty'
        };

        const dataAfterValidation = {
            login: '',
            name: 'Tomas',
            age: 17,
            role_id: 11,
            date: '12.15.2015',
            password: 'qwerty'
        };

        const attributeLabels = {
            age: 'Возраст'
        };

        const result = {
            age: [
                '"Возраст" must be greater or equal to 18.'
            ],
            date: [
                'Date is invalid'
            ],
            group: [
                'Group cannot be blank.'
            ],
            password: [
                'Password should contain at least 8 characters.'
            ]
        };

        const rules = [
            [['login'], 'required', {strict: true}],
            [['name', 'age', 'password', 'group'], 'required'],
            [['login', 'name'], 'filter', {filter: _String.trim}],
            [['login', 'name'], 'string', {min: 4}],
            ['password', 'string', {min: 8}],
            ['password', isContainNumber, {skipOnError: true}],
            ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}], // default message {attribute} must be no less than {min}.
            ['role_id', 'default', {value: 11}],
            ['date', checkDate, {from: '12.12.2015'}]
        ];

        function checkDate(value, attributeLabel, options) {
            if (!isCorrectDate(value)) {
                if (value < options.from)  {
                    return attributeLabel + ' must be greater than ' + options.from;
                }

                return attributeLabel + ' is invalid';
            }

            return false;
        }

        function isContainNumber(value, attributeLabel, options) {
            return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
        }

        function isCorrectDate () {
            return false;
        }

        it('sync', function () {
            const data = _.clone(_data);

            const errors = validate(rules, data, attributeLabels);

            assert.deepEqual(errors, result);

            assert.deepEqual(data, dataAfterValidation);
        });

        it('async', async function () {
            const data = _.clone(_data);

            const errors = await asyncValidate(rules, data, attributeLabels);

            assert.deepEqual(errors, result);

            assert.deepEqual(data, dataAfterValidation);
        });
    });
});
