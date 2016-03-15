var assert = require('assert');
var _ = require('lodash');
var _String = require('underscore.string');
var ValidatorSync = require('../lib/validatorSync');

describe('Validator', function () {
    describe('#wrong rule', function () {
        it('should throw an exception', function () {
            var data = {
                first_name: 'tom'
            };

            assert.throws(
                function() {
                    ValidatorSync.validate([
                        [['role_id', 'first_name']]
                    ], data)
                },
                /Rule should contain at least 2 arguments:role_id,first_name/
            );
        });
    });

    describe('#non existent validator', function () {
        it('should throw an exception', function () {
            var data = {
                first_name: 'tom'
            };

            assert.throws(
                function() {
                    ValidatorSync.validate([
                        [['role_id', 'first_name'], 'primary_key']
                    ], data)
                },
                /Validator not found primary_key/
            );
        });
    });

    describe('#filter', function () {
        it('should apply filter', function () {
            var data = {
                first_name: ' tom ',
                second_name: ' cruise'
            };
            var result = {
                first_name: 'Tom',
                second_name: 'Cruise'
            };

            ValidatorSync.validate([
                [['name', 'first_name', 'second_name'], 'filter', {filter: _String.trim}],
                [['first_name', 'second_name'], 'filter', {filter: _String.capitalize}]
            ], data);

            assert.deepEqual(result, data);
        });

        it('should throw an exception', function () {
            assert.throws(
                function() {
                    ValidatorSync.validate([
                        [['role_id', 'first_name'], 'filter']
                    ], {role_id: 0});
                },
                /The `filter` property must be set./
            );
        });
    });

    describe('#default', function () {
        it('should set default values', function () {
            var data = {
                name: 'tom',
                login: '',
                role_id: null,
                parents: []
            };

            var result = {
                name: 'tom',
                login: 'pantry',
                password: 123456,
                role_id: 11,
                parents: [5, 12],
                time: Math.floor(Date.now() /1000),
                date: Math.floor(Date.now() /1000)
            };

            function getDate() {
                return Math.floor(Date.now() /1000);
            }

            ValidatorSync.validate([
                [['login', 'name'], 'default', {value: 'pantry'}],
                ['password', 'default', {value: 123456}],
                ['role_id', 'default', {value: 11}],
                ['parents', 'default', {value: [5, 12]}],
                ['time', 'default', {value: Math.floor(Date.now() /1000)}],
                ['date', 'default', {value: getDate}]
            ], data);

            assert.deepEqual(result, data);
        });
    });

    describe('#required', function () {
        it('should  required', function () {
            var data = {
                first_name: 'Tom'
            };

            var result = {
                age : [
                    'Возраст cannot be blank.'
                ],
                second_name: [
                    'Second name cannot be blank.'
                ],
                parents: [
                    'Field parents cannot be blank.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['age', 'first_name', 'second_name'], 'required'],
                [['parents'], 'required', {message: 'Field {attribute} cannot be blank.', lowercaseLabel: true}]
            ], data, {age: 'Возраст'});

            assert.deepEqual(result, errors);
        });
    });

    describe('#array', function () {
        it('should  required', function () {
            var data = {
                role_id : [12, 30],
                order_id: ['order1', 'order2'],
                rates: [34.66, 73.55],
                emptyArray: [],
                notArray: null
            };

            var result = {
                notArray: [
                    'Not array must be an array.'
                ],
                emptyArray: [
                    'Empty array must not be empty.'
                ],
                order_id: [
                    'Order is not an array of number.'
                ],
                rates: [
                    'Rates is not an array of id.'
                ],
                role_id: [
                    'Role is not an array of string.',
                    'Role has incorrect elements.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['role_id', 'emptyArray', 'notArray'], 'array'],
                [['role_id', 'emptyArray'], 'array', {notEmpty: true}],
                [['role_id', 'order_id'], 'array', {type: 'string'}],
                [['role_id', 'order_id', 'rates'], 'array', {type: 'number'}],
                [['role_id'], 'array', {type: 'integer'}],
                [['role_id', 'rates'], 'array', {type: 'id'}],
                [['role_id'], 'array', {type: _.isObject, typeMessage: '{attribute} has incorrect elements.'}]
            ], data);

            assert.deepEqual(result, errors);
        });

        it('should throw an exception', function () {
            assert.throws(
                function() {
                    ValidatorSync.validate([
                        [['role_id'], 'array', {type: {}}]
                    ], {role_id: []});
                },
                /The `type` property is wrong./
            );
        });
    });

    describe('#id', function () {
        it('should  required', function () {
            var data = {
                role_id : 5,
                group_id: '12',
                campus_id: 0
            };

            var result = {
                group_id: [
                    'Group must be an integer.'
                ],
                campus_id: [
                    'Campus must be correct id.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['role_id', 'group_id', 'campus_id'], 'id']
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#in', function () {
        it('should  required', function () {
            var data = {
                role_id : 5,
                group_id: 12,
                gender: 3
            };

            var result = {
                group_id: [
                    'Group is invalid.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['role_id'], 'in', {range: [1, 4, '5', 7]}],
                ['group_id', 'in', {range: ['11', '12', '13'], strict: true}],
                ['gender', 'in', {range: [12, 13], not: true}]
            ], data);

            assert.deepEqual(result, errors);
        });

        it('should throw an exception', function () {
            assert.throws(
                function() {
                    ValidatorSync.validate([
                        ['gender', 'in']
                    ], {});
                },
                /The `range` property must be set./
            );
        });
    });

    describe('#boolean', function () {
        it('should  required', function () {
            var data = {
                active : 1,
                has_error: 0,
                has_child: false
            };

            var result = {
                active: [
                    'Active is not boolean.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['active'], 'boolean', {strict: true}],
                ['has_error', 'boolean'],
                ['has_child', 'boolean']
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#compare', function () {
        it('should  required', function () {
            var data = {
                active : 1,
                amount: 0,
                tax: '17'
            };

            var result = {
                amount: [
                    'Amount is invalid.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['active'], 'compare', {compareValue: true}],
                ['amount', 'compare', {compareValue: false, operator: '==='}],
                ['tax', 'compare', {compareValue: 18, operator: '>='}]
            ], data);

            assert.deepEqual(result, errors);
        });

        it('should throw an exception', function () {
            assert.throws(
                function() {
                    ValidatorSync.validate([
                        ['gender', 'compare']
                    ], {});
                },
                /The `compareValue` property must be set./
            );
        });
    });

    describe('#match', function () {
        it('should  required', function () {
            var data = {
                id : 123213,
                login: 122,
                note: 1
            };

            var result = null;

            var errors = ValidatorSync.validate([
                ['id', 'match', {pattern: /^\d+$/}],
                ['login', 'match', {pattern: /^[\S]{3,16}$/}],
                [['note'], 'match', {pattern: /^[\S]{3,16}$/, not: true}]
            ], data);

            assert.deepEqual(result, errors);
        });

        it('should throw an exception (undefined property)', function () {
            assert.throws(
                function() {
                    ValidatorSync.validate([
                        ['gender', 'match']
                    ], {});
                },
                /The `pattern` property must be set./
            );
        });

        it('should throw an exception (incorrect property)', function () {
            assert.throws(
                function() {
                    ValidatorSync.validate([
                        ['gender', 'match', {pattern: ''}]
                    ], {});
                },
                /The `pattern` property must be set./
            );
        });
    });

    describe('#email', function () {
        it('should  required', function () {
            var data = {
                emailA : 123213,
                emailB: 'test',
                emailC: 'test@pantryretail.com'
            };

            var result = {
                emailA: [
                    'Email a is not a valid email address.'
                ],
                emailB: [
                    'Email b is not a valid email address.'
                ]
            };

            var errors = ValidatorSync.validate([
                ['emailA', 'email'],
                ['emailB', 'email'],
                ['emailC', 'email']
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#string', function () {
        it('should  required', function () {
            var data = {
                stringA: '123213',
                stringB: '123456',
                stringC: '1234567',
                stringD: '123',
                stringE: '1234',
                stringF: '1234567890',
                stringG: '',
                notString: 2222
            };

            var result = {
                notString: [
                    'Not string must be a string.'
                ],
                stringC: [
                    'String c should contain 6 characters.'
                ],
                stringD: [
                    'String d should contain at least 4 characters.'
                ],
                stringF: [
                    'String f should contain at most 6 characters.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['stringA', 'notString'], 'string'],
                [['stringB', 'stringC'], 'string', {length: 6}],
                [['stringD', 'stringE', 'stringF'], 'string', {min: 4, max: 6}],
                [['stringG'], 'string']
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#number', function () {
        it('should  required', function () {
            var data = {
                numberA: 123.56,
                integerB: 123456,
                numberC: 12345.6743242,
                numberD: 0,
                numberE: 4,
                numberF: 7,
                numberG: 3,
                numberH: 5,
                numberI: 6,
                numberJ: 7,
                notNumber: '123213'
            };

            var result = {
                notNumber: [
                    'Not number must be an number.'
                ],
                numberC: [
                    'Number c must be an integer.'
                ],
                numberF: [
                    'Number f must be no greater than 6.'
                ],
                numberG: [
                    'Number g must be no less than 4.'
                ],
                numberJ: [
                    'Number j must be no greater than 6.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['numberA', 'numberD'], 'number'],
                [['integerB', 'numberC'], 'integer'],
                [['numberE', 'numberF'], 'number', {min: 4, max: 6}],
                [['numberG', 'numberH'], 'number', {min: 4}],
                [['numberI', 'numberJ'], 'number', {max: 6}],
                [['notNumber'], 'number']
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#functionValidator', function () {
        it('should  required', function () {
            var data = {
                box_id_list_1: [12, 4, 2],
                box_id_list_2: ['a', 'b']
            };

            function isCorrectIdList (id_list, attributeLabel, options) {
                if (!_.isArray(id_list)) {
                    return attributeLabel + ' is invalid.';
                }

                for (var i = 0; i < id_list.length; i++) {
                    if (!_.isNumber(id_list[i])) {
                        return attributeLabel + ' is invalid.';
                    }
                }

                return false;
            }

            var result = {
                box_id_list_2: [
                    'Box id list 2 is invalid.'
                ]
            };

            var errors = ValidatorSync.validate([
                [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#skipOnError', function () {
        it('should skip the second validator', function () {
            var data = {
                password: 'mypass'
            };

            function isContainNumber(value, attributeLabel, options) {
                return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
            }

            var result = {
                password: [
                    'Password should contain at least 8 characters.'
                ]
            };

            var errors = ValidatorSync.validate([
                ['password', 'string', {min: 8}],
                ['password', isContainNumber, {skipOnError: true}]
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#skipOnEmpty', function () {
        it('should skip both validations (undefined and null)', function () {
            var data = {
                login: null
            };

            var result = null;

            var errors = ValidatorSync.validate([
                ['login', 'string', {skipOnEmpty: true}],
                ['password', 'number', {skipOnEmpty: true}]
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#requiredOrderAndSkip', function () {
        it('order not matters', function () {
            var data = {};

            var result = {
                login: [
                    'Login cannot be blank.'
                ]
            };

            var errors = ValidatorSync.validate([
                ['login', 'string', {min: 4}],
                ['login', 'required']
            ], data);

            assert.deepEqual(result, errors);
        });
    });

    describe('#order', function () {
        it('should set default values', function () {
            var data = {
                login: '',
                name: ' Tomas ',
                age: 17,
                role_id: null,
                date: '12.15.2015',
                password: 'qwerty'
            };

            var attributeLabels = {
                age: 'Возраст'
            };

            function checkDate(value, attributeLabel, options) {
                if (!isCorrectDate(value)) {
                    if (value < options.from)  {
                        return attributeLabel + ' must be greater than ' + options.from;
                    }

                    return attributeLabel + ' is invalid';
                }

                return false;
            }

            function isContainNumber(value, attributeLabel, options) {
                return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
            }

            var errors = ValidatorSync.validate([
                [['login', 'name', 'age', 'password', 'group'], 'required'],
                [['login', 'name'], 'filter', {filter: _String.trim}],
                [['login', 'name'], 'string', {min: 4}],
                ['password', 'string', {min: 8}],
                ['password', isContainNumber, {skipOnError: true}],
                ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}], // default message {attribute} must be no less than {min}.
                ['role_id', 'default', {value: 11}],
                ['date', checkDate, {from: '12.12.2015'}],

            ], data, attributeLabels);

            function isCorrectDate () {
                return false;
            }
        });
    });

    describe('#performance', function () {
        it('check execution time', function () {
            var data = {
                login: ' tom ',
                name: ' Tomas ',
                age: 17,
                role_id: null,
                date: '12.15.2015',
                password: 'qwerty',
                group_id: 12
            };

            var attributeLabels = {
                age: 'Возраст',
                telephone: 'Телефон'
            };


            var start = Date.now();

            for (var i = 0; i < 1000; i++) {
                run();
            }

            console.log('time', Date.now() - start, 'ms');

            function run() {
                ValidatorSync.validate([
                    [['login', 'name', 'age', 'password', 'group_id', 'address', 'telephone'], 'required'],
                    [['login', 'name', 'password', 'address', 'telephone'], 'filter', {filter: _String.trim}],
                    [['login', 'name'], 'string', {min: 4}],
                    ['address', 'string', {max: 70}],
                    ['login', 'match', {pattern: /^[\S]{3,16}$/}],
                    ['password', 'string', {min: 8}],
                    ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}],
                    ['role_id', 'compare', {skipOnEmpty: true, compareValue: 1, operator: '!='}],
                    ['role_id', 'default', {value: 2}],
                    ['group_id', 'in', {range: [10, 11, 12, 13]}],
                    ['group_id', 'in', {range: [1, 2, 3], not: true}]
                ], data, attributeLabels);
            }
        });
    });
});