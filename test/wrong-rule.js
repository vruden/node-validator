const assert = require('assert');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('wrong rule', function () {
    describe('should throw an exception', function () {
        const data = {
            first_name: 'tom'
        };

        const rules = [
            [['role_id', 'first_name']]
        ];

        it('sync', function () {
            try {
                validate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /Rule should contain at least 2 arguments: role_id,first_name/
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
                    /Rule should contain at least 2 arguments: role_id,first_name/
                );
            }
        });
    });
});