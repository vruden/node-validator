const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('functionValidator', function () {
    describe('sync function', function () {
        const data = {
            box_id_list_1: [12, 4, 2],
            box_id_list_2: ['a', 'b']
        };

        const result = {
            box_id_list_2: [
                'Box id list 2 is invalid.'
            ]
        };

        const rules = [
            [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
        ];

        function isCorrectIdList (id_list, attributeLabel, options) {
            if (!_.isArray(id_list)) {
                return attributeLabel + ' is invalid.';
            }

            for (let i = 0; i < id_list.length; i++) {
                if (!_.isNumber(id_list[i])) {
                    return attributeLabel + ' is invalid.';
                }
            }

            return false;
        }

        it('sync ', function () {
            const errors = validate(rules, data);

            assert.deepEqual(result, errors);
        });

        it('async ', async function () {
            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });

    describe('async function', function () {
        it('async ', async function () {
            const data = {
                box_id_list_1: [12, 4, 2],
                box_id_list_2: ['a', 'b']
            };

            const result = {
                box_id_list_2: [
                    'Box id list 2 is invalid.'
                ]
            };

            function isCorrectIdList (id_list, attributeLabel, options) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (!_.isArray(id_list)) {
                            return resolve(attributeLabel + ' is invalid.');
                        }

                        for (let i = 0; i < id_list.length; i++) {
                            if (!_.isNumber(id_list[i])) {
                                return resolve(attributeLabel + ' is invalid.');
                            }
                        }

                        resolve(false);
                    }, 0);
                });
            }


            const errors = await asyncValidate([
                [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('sync function (throw exception)', function () {
        const data = {
            box_id_list_1: [12, 4, 2],
            box_id_list_2: ['a', 'b']
        };

        const rules = [
            [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
        ];

        function isCorrectIdList (id_list, attributeLabel, options) {
            return new Error('Invalid argument');
        }

        it('sync', function () {
            try {
                validate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /Invalid argument/
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
                    /Invalid argument/
                );
            }
        });
    });

    it('async function (throw exception) ', async function () {
        const data = {
            box_id_list_1: [12, 4, 2],
            box_id_list_2: ['a', 'b']
        };

        function isCorrectIdList (id_list, attributeLabel, options) {
            return new Promise((resolve, reject) => {
                reject(new Error('Invalid argument'));
            });
        }

        try {
            await asyncValidate([
                [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
            ], data);
        } catch (err) {
            assert.throws(
                () => {
                    assert.ifError(err)
                },
                /Invalid argument/
            );
        }
    });
});