const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('compare', function () {
    describe('should throw an exception', function () {
        const rules = [
            ['gender', 'compare']
        ];

        it('sync', function () {
            try {
                validate(rules, {});
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `compareValue` property must be set./
                );
            }
        });

        it('async', async function () {
            try {
                await asyncValidate(rules, {});
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `compareValue` property must be set./
                );
            }
        });
    });

    describe('should work correctly', function () {
        const _data = {
            active : 1,
            amount: 0,
            tax: '17',
            age: 15
        };

        const _result = {
            amount: [
                'Amount is invalid.'
            ],
            age: [
                'Age is invalid.'
            ]
        };

        const _rules = [
            [['active'], 'compare', {compareValue: true}],
            ['amount', 'compare', {compareValue: false, operator: '==='}],
            ['tax', 'compare', {compareValue: 18, operator: '>='}],
            ['age', 'compare', {compareValue: getValue}]
        ];

        function getValue() {
            return 17;
        }

        it('sync', function () {
            const errors = validate(_rules, _data);

            assert.deepEqual(_result, errors);
        });

        it('async', async function () {
            const data = _.clone(_data);
            const result = _.clone(_result);
            const rules = _.clone(_rules);

            data.order_id = 14;
            result.order_id = [
                'Order is invalid.'
            ];
            rules.push(['order_id', 'compare', {compareValue: getAsyncValue}]);

            function getAsyncValue() {
                return new Promise((resolve) => {resolve(13)});
            }

            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});