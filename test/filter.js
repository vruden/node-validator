const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('filter', function () {
    describe('should throw an exception', function () {
        const data = {role_id: 0};

        const rules = [
            [['role_id', 'first_name'], 'filter']
        ];

        it('sync', function () {
            try {
                validate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `filter` property must be set./
                );
            }
        });

        it('async', async function () {
            try {
                await asyncValidate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `filter` property must be set./
                );
            }
        });
    });

    describe('should apply filter', function () {
        const _data = {
            first_name: ' tom ',
            second_name: ' cruise',
            age: 14
        };

        const _result = {
            first_name: 'Tom',
            second_name: 'Cruise',
            age: 18
        };

        const _rules = [
            [['name', 'first_name', 'second_name'], 'filter', {filter: _String.trim}],
            [['first_name', 'second_name'], 'filter', {filter: _String.capitalize}],
            [['age'], 'filter', {filter: increase}]
        ];

        function increase(value) {
            return value + 4;
        }

        it('sync', function () {
            const data = _.clone(_data);
            const result = _.clone(_result);

            validate(_rules, data);

            assert.deepEqual(data, result);
        });

        it('async', async function () {
            const data = _.clone(_data);
            const result = _.clone(_result);
            const rules = _.clone(_rules);

            data.account = 1000;
            result.account = 2000;
            rules.push([['account'], 'filter', {filter: asyncIncrease}]);

            function asyncIncrease(value) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(value * 2);
                    }, 0);

                });
            }

            await asyncValidate(rules, data);

            assert.deepEqual(data, result);
        });
    });
});