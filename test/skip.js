const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('skip', function () {
    describe('should skip rules', function () {
        const data = {};

        const result = undefined;

        const _rules = [
            ['password', 'required', {skip: skip}]
        ];

        function skip(value, options, callback) {
            return true;
        }

        it('sync', function () {
            const errors = validate(_rules, data);

            assert.deepEqual(result, errors);
        });

        it('async', async function () {
            const rules = _.clone(_rules);
            rules.push(['password', 'required', {skip: asyncSkip}]);

            function asyncSkip() {
                return new Promise((resolve) => {resolve(true)});
            }

            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});