const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('default', function () {
    describe('should set default values', function () {
        const timestamp = Math.floor(Date.now() /1000);

        const _data = {
            name: 'tom',
            login: '',
            role_id: null,
            parents: [],
            child: {}
        };

        const _result = {
            name: 'tom',
            login: 'pantry',
            password: 123456,
            role_id: 11,
            parents: [5, 12],
            time: timestamp,
            date: timestamp,
            child: {
                id: 234
            }
        };

        function getDate() {
            return timestamp;
        }

        it('sync', function () {
            const data = _.clone(_data);
            const result = _.clone(_result);

            validate([
                [['login', 'name'], 'default', {value: 'pantry'}],
                ['password', 'default', {value: 123456}],
                ['role_id', 'default', {value: 11}],
                ['parents', 'default', {value: [5, 12]}],
                ['time', 'default', {value: Math.floor(Date.now() /1000)}],
                ['date', 'default', {value: getDate}],
                ['child', 'default', {value: {id: 234}}]
            ], data);

            assert.deepEqual(data, result);
        });

        it('async', async function () {
            const data = _.clone(_data);
            const result = _.clone(_result);

            result.created_time = timestamp;

            function getDateAsync() {
                return new Promise((resolve) => {
                    resolve(timestamp);
                });
            }

            await asyncValidate([
                [['login', 'name'], 'default', {value: 'pantry'}],
                ['password', 'default', {value: 123456}],
                ['role_id', 'default', {value: 11}],
                ['parents', 'default', {value: [5, 12]}],
                ['time', 'default', {value: Math.floor(Date.now() /1000)}],
                ['date', 'default', {value: getDate}],
                ['child', 'default', {value: {id: 234}}],
                [['created_time'], 'default', {value: getDateAsync}]
            ], data);

            assert.deepEqual(data, result);
        });
    });
});