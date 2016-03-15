'use strict';

var _ = require('lodash');
var HttpError = require('node-errors').HttpError;
var Validator = require('./validator');
var ValidationRules = require('./validation-rules');

// Express Middleware for validation
function validate(req, res, next) {
    var rules = ValidationRules.get_rules(req.cmd);
    var attributeLabels = ValidationRules.get_attribute_labels(req.cmd);

    if (_.isUndefined(rules)) {
        return next(new HttpError(501, 'Validation rules not found for the command: ' + req.cmd));
    }

    Validator.validate(rules, req.args, attributeLabels, {req: req}, next);
}

module.exports = validate;