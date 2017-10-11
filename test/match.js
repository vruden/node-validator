const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('match', function () {
    describe('should throw an exception (undefined property)', function () {
        it('sync', function () {
            try {
                validate([
                    ['gender', 'match']
                ], {gender: 'male'});
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `pattern` property must be set./
                );
            }
        });

        it('async', async function () {
            try {
                await asyncValidate([
                    ['gender', 'match']
                ], {gender: 'male'});
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `pattern` property must be set./
                );
            }
        });
    });

    describe('should throw an exception (incorrect property)', function () {
        it('async', function () {
            try {
                validate([
                    ['gender', 'match', {pattern: ''}]
                ], {gender: 'male'});
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `pattern` property must be set./
                );
            }
        });

        it('async', async function () {
            try {
                await asyncValidate([
                    ['gender', 'match', {pattern: ''}]
                ], {gender: 'male'});
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `pattern` property must be set./
                );
            }
        });
    });

    describe('should work correctly', function () {
        const data = {
            id : 123213,
            login: 122,
            note: 1
        };

        const result = undefined;

        const rules = [
            ['id', 'match', {pattern: /^\d+$/}],
            ['login', 'match', {pattern: /^[\S]{3,16}$/}],
            [['note'], 'match', {pattern: /^[\S]{3,16}$/, not: true}]
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