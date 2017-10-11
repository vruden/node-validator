const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const asyncValidate = require('../lib/async-validator').validate;

describe('performance', function () {
    this.timeout(3000);

    it('should ', async function () {
        const data = {
            login: ' tom ',
            name: ' Tomas ',
            age: 17,
            role_id: null,
            date: '12.15.2015',
            password: 'qwerty',
            group_id: 12
        };

        const attributeLabels = {
            age: 'Возраст',
            telephone: 'Телефон'
        };

        for(let i = 0; i < 1000; i++) {
            await asyncValidate([
                [['login', 'name', 'age', 'password', 'group_id', 'address', 'telephone'], 'required'],
                [['login', 'name', 'password', 'address', 'telephone'], 'filter', {filter: _String.trim}],
                [['login', 'name'], 'string', {min: 4}],
                ['address', 'string', {max: 70}],
                ['login', 'match', {pattern: /^[\S]{3,16}$/}],
                ['password', 'string', {min: 8}],
                ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}],
                ['role_id', 'compare', {skipOnEmpty: false, compareValue: 1, operator: '!='}],
                ['role_id', 'default', {value: 2}],
                ['group_id', 'in', {range: [10, 11, 12, 13]}],
                ['group_id', 'in', {range: [1, 2, 3], not: true}]
            ], data, attributeLabels);
        }
    });
});