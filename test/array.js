const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('array', function () {
    describe('should throw an exception', function () {
        const data = {
            role_id : [12, 30]
        };

        const rules = [
            [['role_id'], 'array', {type: {}}]
        ];

        it('sync', async function () {
            try {
                validate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `type` property is wrong./
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
                    /The `type` property is wrong./
                );
            }
        });
    });

    describe('should work correctly', function () {
        const data = {
            role_id : [12, 30],
            order_id: ['order1', 'order2'],
            rates: [34.66, 73.55],
            emptyArray: [],
            _null: null
        };

        const result = {
            _null: [
                'Null must be an array.'
            ],
            emptyArray: [
                'Empty array must not be empty.'
            ],
            role_id: [
                'Role is not an array of string.',
                'Role has incorrect elements.'
            ],
            order_id: [
                'Order is not an array of number.'
            ],
            rates: [
                'Rates is not an array of id.'
            ]
        };

        const rules = [
            ['_null', 'array', {skipOnEmpty: false}],
            [['role_id', 'emptyArray'], 'array', {notEmpty: true, skipOnEmpty: false}],
            [['role_id', 'order_id'], 'array', {type: 'string'}],
            [['role_id', 'order_id', 'rates'], 'array', {type: 'number'}],
            [['role_id'], 'array', {type: 'integer'}],
            [['role_id', 'rates'], 'array', {type: 'id'}],
            [['role_id'], 'array', {type: _.isObject, typeMessage: '{attribute} has incorrect elements.', skipOnError: false}]
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