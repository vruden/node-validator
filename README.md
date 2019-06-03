# Validator for js

# Install

    $ npm install validator-list


# How to use
```js
    const ValidatorList = require('validator-list');

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
    
    function isCorrectDate () {
        return false;
    }

    function isContainNumber(value, attributeLabel, options) {
        return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
    }

    var errors = ValidatorList.validate([
        [['login', 'name', 'age', 'password', 'group'], 'required'],
        [['login', 'name'], 'filter', {filter: _String.trim}],
        [['login', 'name'], 'string', {min: 4}],
        ['password', 'string', {min: 8}],
        ['password', isContainNumber, {skipOnError: true}],
        ['age', 'integer', {min: 18, tooSmall: '"{attribute}" must be greater or equal to {min}.'}], // default message {attribute} must be no less than {min}.
        ['role_id', 'default', {value: 11}],
        ['date', checkDate, {from: '12.12.2015'}],

    ], data, attributeLabels);

    console.log(data)
    
    { login: '',
      name: 'Tomas',
      age: 17,
      role_id: 11,
      date: '12.15.2015',
      password: 'qwerty' 
    }


    console.log(errors)
    
    { 
        group: [ 'Group cannot be blank.' ],
        login: [ 'Login should contain at least 4 characters.' ],
        password: [ 'Password should contain at least 8 characters.' ],
        age: [ '"Возраст" must be greater or equal to 18.' ],
        date: [ 'Date is invalid' ] 
    }
```

# List of errors:
* [Filter](#filter)
* [Default](#default)
* [Required](#required)
* [Array](#array)
* [ID](#id)
* [In range](#in-range)
* [Boolean](#boolean)
* [Compare](#compare)
* [Match](#match)
* [Email](#email)
* [String](#string)
* [Number](#number)
* [Own Validator](#own-validator)
* [skipOnError](#skipOnError)
* [skipOnEmpty](#skipOnEmpty)
* [Filter](#Filter)

## Filter
```js
    var data = {
        first_name: ' tom ',
        second_name: ' cruise'
    };
    ValidatorList.validate([
        [['name', 'first_name', 'second_name'], 'filter', {filter: _String.trim}],
        [['first_name', 'second_name'], 'filter', {filter: _String.capitalize}]
    ], data);
    
    console.log(data);
    
    {
        first_name: 'Tom',
        second_name: 'Cruise'
    }
```

## Default
```js
    var data = {
        name: 'tom',
        login: '',
        role_id: null,
        parents: []
    };

    function getDate() {
        return Math.floor(Date.now() /1000);
    }

    ValidatorList.validate([
        [['login', 'name'], 'default', {value: 'pantry'}],
        ['password', 'default', {value: 123456}],
        ['role_id', 'default', {value: 11}],
        ['parents', 'default', {value: [5, 12]}],
        ['time', 'default', {value: Math.floor(Date.now() /1000)}],
        ['date', 'default', {value: getDate}]
    ], data);
    
    console.log(data);
    
    {
        name: 'tom',
        login: 'pantry',
        password: 123456,
        role_id: 11,
        parents: [5, 12],
        time: Math.floor(Date.now() /1000),
        date: Math.floor(Date.now() /1000)
    }
```
    
## Required
```js
    const data = {
        first_name: 'Tom',
        age: null,
        second_name: null,
        range1: [],
        range2: [],
        string1: '   ',
        string2: '   '
    };

    var errors = ValidatorList.validate([
        [['age', 'first_name', 'range1', 'string1'], 'required'],
        [['second_name', 'range2', 'string2'], 'required', {strict: true}],
        [['parents'], 'required', {message: 'Field {attribute} cannot be blank.', lowercaseLabel: true}]
    ], data, {age: 'Возраст'});
    
    console.log(errors)
    
    {
        age : [
            'Возраст cannot be blank.'
        ],
        range1: [
            'Range1 cannot be blank.'
        ],
        string1: [
            'String1 cannot be blank.'
        ],
        parents: [
            'Field parents cannot be blank.'
        ]
    };
```

## Array
```js
    var data = {
        role_id : [12, 30],
        order_id: ['order1', 'order2'],
        rates: [34.66, 73.55],
        emptyArray: [],
        notArray: null
    };

    var errors = ValidatorList.validate([
        [['role_id', 'emptyArray', 'notArray'], 'array'],
        [['role_id', 'emptyArray'], 'array', {notEmpty: true}],
        [['role_id', 'order_id'], 'array', {type: 'string'}],
        [['role_id', 'order_id', 'rates'], 'array', {type: 'number'}],
        [['role_id'], 'array', {type: 'integer'}],
        [['role_id', 'rates'], 'array', {type: 'id'}],
        [['role_id'], 'array', {type: _.isObject, typeMessage: '{attribute} has incorrect elements.'}]
    ], data);
    
    console.log(errors)
    
    {
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
    }
```
    
## ID
```js
    var data = {
        role_id : 5,
        group_id: '12',
        campus_id: 0
    };
    
    var errors = ValidatorList.validate([
        [['role_id', 'group_id', 'campus_id'], 'id']
    ], data);
    
    console.log(errors)
    
    {
        group_id: [
            'Group must be an integer.'
        ],
        campus_id: [
            'Campus must be correct id.'
        ]
    }
```
 
## In range
```js
    var data = {
        role_id : 5,
        group_id: 12,
        gender: 3
    };

    var errors = ValidatorList.validate([
        [['role_id'], 'in', {range: [1, 4, '5', 7]}],
        ['group_id', 'in', {range: ['11', '12', '13'], strict: true}],
        ['gender', 'in', {range: [12, 13], not: true}]
    ], data);
    
    console.log(errors)
    
    {
        group_id: [
            'Group is invalid.'
        ]
    }
```

## Boolean
```js
    var data = {
        active : 1,
        has_error: 0,
        has_child: false
    };

    var errors = ValidatorList.validate([
        [['active'], 'boolean', {strict: true}],
        ['has_error', 'boolean'],
        ['has_child', 'boolean']
    ], data);
    
    console.log(errors)
    
    {
        active: [
            'Active is not boolean.'
        ]
    }
```
  
## Compare
```js
    var data = {
        active : 1,
        amount: 0,
        tax: '17'
    };

    var errors = ValidatorList.validate([
        [['active'], 'compare', {compareValue: true}],
        ['amount', 'compare', {compareValue: false, operator: '==='}],
        ['tax', 'compare', {compareValue: 18, operator: '>='}]
    ], data);
    
    console.log(errors)
    
    {
        amount: [
            'Amount is invalid.'
        ]
    }
```
 
## Match
```js
    var data = {
        id : 123213,
        login: 122,
        note: 1
    };

    var errors = ValidatorList.validate([
        ['id', 'match', {pattern: /^\d+$/}],
        ['login', 'match', {pattern: /^[\S]{3,16}$/}],
        [['note'], 'match', {pattern: /^[\S]{3,16}$/, not: true}]
    ], data);
    
    console.log(errors)
    
    null
```
    
## Email
```js
    var data = {
        emailA : 123213,
        emailB: 'test',
        emailC: 'test@pantryretail.com'
    };

    var errors = ValidatorList.validate([
        ['emailA', 'email'],
        ['emailB', 'email'],
        ['emailC', 'email']
    ], data);
    
    console.log(errors)
    
    {
        emailA: [
            'Email a is not a valid email address.'
        ],
        emailB: [
            'Email b is not a valid email address.'
        ]
    }
```
   
## String
```js
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

    var errors = ValidatorList.validate([
        [['stringA', 'notString'], 'string'],
        [['stringB', 'stringC'], 'string', {length: 6}],
        [['stringD', 'stringE', 'stringF'], 'string', {min: 4, max: 6}],
        [['stringG'], 'string']
    ], data);
    
    {
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
    }
```

## Number
```js
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

    var result = ;

    var errors = ValidatorList.validate([
        [['numberA', 'numberD'], 'number'],
        [['integerB', 'numberC'], 'integer'],
        [['numberE', 'numberF'], 'number', {min: 4, max: 6}],
        [['numberG', 'numberH'], 'number', {min: 4}],
        [['numberI', 'numberJ'], 'number', {max: 6}],
        [['notNumber'], 'number']
    ], data);
    
    console.log(errors)
    
    {
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
    }
```
    
## Own Validator
```js    
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

    var errors = ValidatorList.validate([
        [['box_id_list_1', 'box_id_list_2'], isCorrectIdList]
    ], data);
    
    console.log(errors)
    
    {
        box_id_list_2: [
            'Box id list 2 is invalid.'
        ]
    }
```

## skipOnError
```js
    var data = {
        password: 'mypass'
    };

    function isContainNumber(value, attributeLabel, options) {
        return value.match(/\d+/g) === null ? attributeLabel + ' must contain at least one number.': false;
    }

    var errors = ValidatorList.validate([
        ['password', 'string', {min: 8}],
        ['password', isContainNumber, {skipOnError: true}]
    ], data);
    
    console.log(errors)
    
    {
        password: [
            'Password should contain at least 8 characters.'
        ]
    }
```

## skipOnEmpty
```js
    var data = {
        login: null
    };

    var errors = ValidatorList.validate([
        ['login', 'string', {skipOnEmpty: true}],
        ['password', 'number', {skipOnEmpty: true}]
    ], data);
    
    console.log(errors)
    
    null
```    
