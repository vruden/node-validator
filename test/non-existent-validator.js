const assert = require('assert');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('non existent validator', function () {
    describe('should throw an exception', function () {
        const data = {
            first_name: 'tom'
        };

        const rules = [
            [['role_id', 'first_name'], 'primary_key']
        ];

        it('sync', function () {
            try {
                validate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /Validator not found primary_key/
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
                    /Validator not found primary_key/
                );
            }
        });
    });
});