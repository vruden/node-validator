const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('mixin', function () {
    describe('shoul work correctly', function () {
        const data = {
            role_id: 234
        };

        const result = undefined;

        const rules = [
            [['role_id'], isCorrectId]
        ];

        function isCorrectId (id, attributeLabel, options) {
            if (id !== options.mixin.defaultRole) {
                return 'Wrong role id';
            }

            return false;
        }

        it('sync', function () {
            const errors = validate(rules, data, {}, {defaultRole: 234});

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const errors = await asyncValidate(rules, data, {}, {defaultRole: 234});

            assert.deepEqual(result, errors);
        });
    });
});