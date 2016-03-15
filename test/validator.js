var assert = require('assert');
var _ = require('lodash');
var _String = require('underscore.string');
var Validator = require('../lib/validator');
var mysql = require('mysql');

var pool = mysql.createPool({
    user: 'root',
    password: '123456'
});

describe('Validator', function () {
    describe('#missing callback', function () {
        it('should throw an exception', function () {
            assert.throws(
                function() {
                    Validator.validate([
                        [['role_id', 'first_name']]
                    ], {});
                },
                /Missing callback function/
            );
        });
    });

    describe('#wrong rule', function () {
        it('should throw an exception', function () {
            var data = {
                first_name: 'tom'
            };

            assert.throws(
                function() {
                    Validator.validate([
                        [['role_id', 'first_name']]
                    ], data, function(err) {
                        assert.ifError(err);
                    });
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
                    Validator.validate([
                        [['role_id', 'first_name'], 'primary_key']
                    ], data, function (err) {
                        assert.ifError(err);
                    });
                },
                /Validator not found primary_key/
            );
        });
    });

    describe('#filter', function () {
        it('should apply filter', function (done) {
            var data = {
                first_name: ' tom ',
                second_name: ' cruise',
                age: 14
            };
            var result = {
                first_name: 'Tom',
                second_name: 'Cruise',
                age: 18
            };

            function increase(value, options, callback) {
                callback(null, value + 4);
            }

            Validator.validate([
                [['name', 'first_name', 'second_name'], 'filter', {filter: _String.trim}],
                [['first_name', 'second_name'], 'filter', {filter: _String.capitalize}],
                [['age'], 'filter', {filter: increase, async: true}]
            ], data, function () {
                assert.deepEqual(result, data);

                done();
            });
        });

        it('should throw an exception', function () {
            assert.throws(
                function() {
                    Validator.validate([
                        [['role_id', 'first_name'], 'filter']
                    ], {role_id: 0}, function (err) {
                        assert.ifError(err);
                    });
                },
                /The `filter` property must be set./
            );
        });
    });

    describe('#default', function () {
        it('should set default values', function (done) {
            var data = {
                name: 'tom',
                login: '',
                role_id: null,
                parents: [],
                child: {}
            };

            var result = {
                name: 'tom',
                login: 'pantry',
                password: 123456,
                role_id: 11,
                parents: [5, 12],
                time: Math.floor(Date.now() /1000),
                date: Math.floor(Date.now() /1000),
                created_time: Math.floor(Date.now() /1000),
                child: {
                    id: 234
                }
            };

            function getDate() {
                return Math.floor(Date.now() /1000);
            }

            function getDateAsync(value, options, callback) {
                callback(null, Math.floor(Date.now() /1000));
            }

            Validator.validate([
                [['login', 'name'], 'default', {value: 'pantry'}],
                ['password', 'default', {value: 123456}],
                ['role_id', 'default', {value: 11}],
                ['parents', 'default', {value: [5, 12]}],
                ['time', 'default', {value: Math.floor(Date.now() /1000)}],
                ['date', 'default', {value: getDate}],
                ['child', 'default', {value: {id: 234}}],
                ['created_time', 'default', {value: getDateAsync, async: true}]
            ], data, function () {

                assert.deepEqual(result, data);

                done();
            });
        });
    });

    describe('#required', function () {
        it('should  required', function (done) {
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

            Validator.validate([
                [['age', 'first_name', 'second_name'], 'required'],
                [['parents'], 'required', {message: 'Field {attribute} cannot be blank.', lowercaseLabel: true}]
            ], data, {age: 'Возраст'}, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#array', function () {
        it('should  required', function (done) {
            var data = {
                role_id : [12, 30],
                order_id: ['order1', 'order2'],
                rates: [34.66, 73.55],
                emptyArray: [],
                _null: null
            };

            var result = {
                _null: [
                    'Null must be an array.'
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

            Validator.validate([
                ['_null', 'array', {skipOnEmpty: false}],
                [['role_id', 'emptyArray'], 'array', {notEmpty: true, skipOnEmpty: false}],
                [['role_id', 'order_id'], 'array', {type: 'string'}],
                [['role_id', 'order_id', 'rates'], 'array', {type: 'number'}],
                [['role_id'], 'array', {type: 'integer'}],
                [['role_id', 'rates'], 'array', {type: 'id'}],
                [['role_id'], 'array', {type: _.isObject, typeMessage: '{attribute} has incorrect elements.', skipOnError: false}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });

        it('should throw an exception', function () {
            var data = {
                role_id : [12, 30]
            };

            assert.throws(
                function() {
                    Validator.validate([
                        [['role_id'], 'array', {type: {}}]
                    ], data, function(err) {
                        assert.ifError(err);
                    });
                },
                /The `type` property is wrong./
            );
        });
    });

    describe('#id', function () {
        it('should  required', function (done) {
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

            Validator.validate([
                [['role_id', 'group_id', 'campus_id'], 'id']
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#in', function () {
        it('should  required', function (done) {
            var data = {
                role_id : 5,
                group_id: 12,
                gender: 3,
                campus_id: 4
            };

            var result = {
                group_id: [
                    'Group is invalid.'
                ],
                campus_id: [
                    'Campus is not in range: 1,2,3,5'
                ]
            };

            function getCampus(value, options, callback) {
                pool.query('SELECT "1,2,3,5" id', [], function (err, rows) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, rows[0].id.split(','));
                });
            }

            Validator.validate([
                [['role_id'], 'in', {range: [1, 4, '5', 7]}],
                ['group_id', 'in', {range: ['11', '12', '13'], strict: true}],
                ['gender', 'in', {range: [12, 13], not: true}],
                ['campus_id', 'in', {range: getCampus, message: '{attribute} is not in range: {range}'}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });

        it('should throw an exception', function () {
            assert.throws(
                function() {
                    Validator.validate([
                        ['gender', 'in']
                    ], {gender: 'male'}, function (err) {
                        assert.ifError(err);
                    });
                },
                /The `range` property must be set./
            );
        });
    });

    describe('#boolean', function () {
        it('should  required', function (done) {
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

            Validator.validate([
                [['active'], 'boolean', {strict: true}],
                ['has_error', 'boolean'],
                ['has_child', 'boolean']
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#compare', function () {
        it('should  required', function (done) {
            var data = {
                active : 1,
                amount: 0,
                tax: '17',
                age: 15
            };

            var result = {
                amount: [
                    'Amount is invalid.'
                ],
                age: [
                    'Age is invalid.'
                ]
            };

            function getValue(value, options, callback) {
                pool.query('SELECT 17 id', [], function (err, rows) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, rows[0].id);
                });
            }

            Validator.validate([
                [['active'], 'compare', {compareValue: true}],
                ['amount', 'compare', {compareValue: false, operator: '==='}],
                ['tax', 'compare', {compareValue: 18, operator: '>='}],
                ['age', 'compare', {compareValue: getValue}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });

            it('should throw an exception', function () {
                assert.throws(
                    function() {
                        Validator.validate([
                            ['gender', 'compare']
                        ], {}, function(err) {
                            assert.ifError(err);
                        });
                    },
                    /The `compareValue` property must be set./
                );
            });
        });
    });

    describe('#match', function () {
        it('should  required', function (done) {
            var data = {
                id : 123213,
                login: 122,
                note: 1
            };

            var result = null;

            Validator.validate([
                ['id', 'match', {pattern: /^\d+$/}],
                ['login', 'match', {pattern: /^[\S]{3,16}$/}],
                [['note'], 'match', {pattern: /^[\S]{3,16}$/, not: true}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });

        it('should throw an exception (undefined property)', function () {
            assert.throws(
                function() {
                    Validator.validate([
                        ['gender', 'match']
                    ], {gender: 'male'}, function(err) {
                        assert.ifError(err);
                    });
                },
                /The `pattern` property must be set./
            );
        });

        it('should throw an exception (incorrect property)', function () {
            assert.throws(
                function() {
                    Validator.validate([
                        ['gender', 'match', {pattern: ''}]
                    ], {gender: 'male'}, function(err) {
                        assert.ifError(err);
                    });
                },
                /The `pattern` property must be set./
            );
        });
    });

    describe('#email', function () {
        it('should  required', function (done) {
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

            Validator.validate([
                ['emailA', 'email'],
                ['emailB', 'email'],
                ['emailC', 'email']
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#string', function () {
        it('should  required', function (done) {
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
                stringB: [
                    'String b should contain at most 4 characters.'
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

            Validator.validate([
                [['stringA', 'notString'], 'string'],
                [['stringB', 'stringC'], 'string', {length: 6}],
                [['stringB'], 'string', {length: [2,4]}],
                [['stringD', 'stringE', 'stringF'], 'string', {min: 4, max: 6}],
                [['stringG'], 'string']
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#number', function () {
        it('should  required', function (done) {
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
                    'Not number must be a number.'
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

            Validator.validate([
                [['numberA', 'numberD'], 'number'],
                [['integerB', 'numberC'], 'integer'],
                [['numberE', 'numberF'], 'number', {min: 4, max: 6}],
                [['numberG', 'numberH'], 'number', {min: 4}],
                [['numberI', 'numberJ'], 'number', {max: 6}],
                [['notNumber'], 'number']
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#functionValidator', function () {
        it('should  required', function (done) {
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

            Validator.validate([
                [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });

        it('async function', function (done) {
            var data = {
                box_id_list_1: [12, 4, 2],
                box_id_list_2: ['a', 'b']
            };

            function isCorrectIdList (id_list, attributeLabel, options, callback) {
                pool.query('SELECT 1', [], function (err) {
                    if (err) {
                        return callback(err);
                    }

                    if (!_.isArray(id_list)) {
                        return callback(attributeLabel + ' is invalid.');
                    }

                    for (var i = 0; i < id_list.length; i++) {
                        if (!_.isNumber(id_list[i])) {
                            return callback(attributeLabel + ' is invalid.');
                        }
                    }

                    return callback();
                });
            }

            var result = {
                box_id_list_2: [
                    'Box id list 2 is invalid.'
                ]
            };

            Validator.validate([
                [['box_id_list_1', 'box_id_list_2'], isCorrectIdList, {async: true}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });

        it('async function (throw exception)', function (done) {
            var data = {
                box_id_list_1: [12, 4, 2],
                box_id_list_2: ['a', 'b']
            };

            function isCorrectIdList (id_list, attributeLabel, options, callback) {
                return callback(new Error('Invalid argument'));
            }

            Validator.validate([
                [['box_id_list_1', 'box_id_list_2'], isCorrectIdList, {async: true}]
            ], data, function (err) {
                assert.throws(
                    function () {
                        assert.ifError(err);
                    },
                    /Invalid argument/
                );

                done();
            });
        });
    });

    describe('#mixins', function () {
        it('should  required', function (done) {
            var data = {
                role_id: 234
            };

            function isCorrectId (id, attributeLabel, options) {
                if (id !== options.mixins.defaultRole) {
                    return 'Wrong role id';
                }

                return false;
            }

            var result = null;

            Validator.validate([
                [['role_id'], isCorrectId]
            ], data, {}, {defaultRole: 234}, function (err) {
                assert.deepEqual(result, null);

                done();
            });
        });
    });

    describe('#callback', function () {
        it('should return array of errors', function (done) {
            var data = {
                login: 'tom',
                age: 12
            };

            var result = {
                login: [
                    'Login should contain at least 4 characters.'
                ],
                age: [
                    'Age must be no less than 21.'
                ]
            };

            Validator.validate([
                ['login', 'string', {min: 4}],
                ['age', 'integer', {min: 21}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });

        it('should return null', function (done) {
            var data = {
                login: 'tomas',
                age: 22
            };

            var result = null;

            Validator.validate([
                ['login', 'string', {min: 4}],
                ['age', 'integer', {min: 21}]
            ], data, function (err) {
                assert.deepEqual(result, err);

                done();
            });
        });
    });

    describe('#skip', function () {
        it('should skip the second validator', function (done) {
            var data = {};

            var result = null;

            function skip(value, options, callback) {
                callback(null, true);
            }

            Validator.validate([
                ['password', 'required', {skip: skip}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#skipOnError', function () {
        it('should skip the second validator', function (done) {
            var data = {
                login: 'mylogin',
                password: 'mypass'
            };

            function isContainNumber(value, attributeLabel, options) {
                return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
            }

            var result = {
                login: [
                    'Login should contain at least 8 characters.',
                    'Login must contain at least one number.'
                ],
                password: [
                    'Password should contain at least 8 characters.'
                ]
            };

            Validator.validate([
                [['login', 'password'], 'string', {min: 8}],
                ['password', isContainNumber],
                ['login', isContainNumber, {skipOnError: false}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#skipOnEmpty', function () {
        it('should skip both validations (undefined and null)', function (done) {
            var data = {
                login: null,
                age: '',
                roles: [],
                note: {},
                id: 4
            };

            var result = {
                id: [
                    'Id must be no less than 5.'
                ],
                login: [
                    'Login must be a string.'
                ],
                password: [
                    'Password must be a number.'
                ]
            };

            Validator.validate([
                ['id', 'number', {min: 5}],
                [['age', 'roles', 'notes'], 'number'],
                ['login', 'string', {skipOnEmpty: false}],
                ['password', 'number', {skipOnEmpty: false}]
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
        });
    });

    describe('#requiredOrderAndSkip', function () {
        it('order not matters', function (done) {
            var data = {};

            var result = {
                login: [
                    'Login cannot be blank.'
                ]
            };

            Validator.validate([
                ['login', 'string', {min: 4}],
                ['login', 'required']
            ], data, function (err) {
                assert.deepEqual(result, err && err.errors);

                done();
            });
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

            Validator.validate([
                [['login', 'name', 'age', 'password', 'group'], 'required'],
                [['login', 'name'], 'filter', {filter: _String.trim}],
                [['login', 'name'], 'string', {min: 4}],
                ['password', 'string', {min: 8}],
                ['password', isContainNumber, {skipOnError: true}],
                ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}], // default message {attribute} must be no less than {min}.
                ['role_id', 'default', {value: 11}],
                ['date', checkDate, {from: '12.12.2015'}],

            ], data, attributeLabels, function () {});

            function isCorrectDate () {
                return false;
            }

        });
    });

    describe('#performance', function () {
        this.timeout(3000);

        it('check execution time', function (done) {
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


            var i = 0;
            next();

            function next() {
                if (i === 1000) {
                    return done();
                }

                Validator.validate([
                    [['login', 'name', 'age', 'password', 'group_id', 'address', 'telephone'], 'required'],
                    [['login', 'name', 'password', 'address', 'telephone'], 'filter', {filter: _String.trim}],
                    [['login', 'name'], 'string', {min: 4}],
                    ['address', 'string', {max: 70}],
                    ['login', 'match', {pattern: /^[\S]{3,16}$/}],
                    ['password', 'string', {min: 8}],
                    ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}],
                    ['role_id', 'compare', {skipOnEmpty: false, compareValue: 1, operator: '!='}],
                    ['role_id', 'default', {value: 2}],
                    ['group_id', 'in', {range: [10, 11, 12, 13]}],
                    ['group_id', 'in', {range: [1, 2, 3], not: true}]
                ], data, attributeLabels, function () {
                    i++;
                    setTimeout(next, 0); // Exception: Maximum call stack size exceeded
                });
            }
        });
    });
});