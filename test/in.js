const assert = require('assert');
const _ = require('lodash');
const _String = require('underscore.string');
const validate = require('../lib/validator').validate;
const asyncValidate = require('../lib/async-validator').validate;

describe('in', function () {
    describe('should throw an exception', function () {
        const data = {gender: 'male'};

        const rules = [
            ['gender', 'in']
        ];

        it('sync', function () {
            try {
                validate(rules, data);
            } catch (err) {
                assert.throws(
                    () => {
                        assert.ifError(err)
                    },
                    /The `range` property must be set./
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
                    /The `range` property must be set./
                );
            }
        });
    });

    describe('should work correctly', function () {
        const _data = {
            role_id : 5,
            group_id: 12,
            gender: 3,
            age: 4
        };

        const _result = {
            age: [
                "Age is not in range: 1, 3, 5, 7"
            ],
            group_id: [
                'Group is invalid.'
            ]
        };

        const _rules = [
            [['role_id'], 'in', {range: [1, 4, '5', 7]}],
            ['group_id', 'in', {range: ['11', '12', '13'], strict: true}],
            ['gender', 'in', {range: [12, 13], not: true}],
            ['age', 'in', {range: getAgeList, message: '{attribute} is not in range: {range}'}]
        ];

        function getAgeList () {
            return [1,3,5,7];
        }

        it('sync ', function () {
            const errors = validate(_rules, _data);

            assert.deepEqual(_result, errors);
        });

        it('async ', async function () {
            const data = _.clone(_data);
            const result = _.clone(_result);
            const rules = _.clone(_rules);

            data.campus_id = 4;
            result.campus_id = [
                'Campus is not in range: 1, 2, 3, 5'
            ];
            rules.push(['campus_id', 'in', {range: getCampus, message: '{attribute} is not in range: {range}'}]);

            function getCampus() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([1,2,3,5]);
                    }, 0);
                });
            }

            const errors = await asyncValidate(rules, data);

            assert.deepEqual(result, errors);
        });
    });
});