'use strict';

var _ = require('lodash');

/**
 * Validation Rules Collection
 */

var _rules = {};
var _attributeLabels = {};

function get_rules(command) {
    return _rules[command];
}

function get_attribute_labels(command) {
    return _attributeLabels[command];
}

function set_rules(commands, rules, attributeLabels) {
    commands = _.isArray(commands) ? commands : [commands];

    _.each(commands, function (command) {
        _rules[command] = rules;
        _attributeLabels[command] = _.extend({}, attributeLabels);
    });
}

function add_rules(commands, rules, attributeLabels) {
    commands = _.isArray(commands) ? commands : [commands];

    _.each(commands, function (command) {
        if (!_.isArray(_rules[command])) {
            _rules[command] = [];
        }

        _rules[command] = _rules[command].concat(rules);
        _attributeLabels[command] = _.extend({}, _attributeLabels[command], attributeLabels);
    });
}

module.exports.set_rules = set_rules;
module.exports.add_rules = add_rules;
module.exports.get_rules = get_rules;
module.exports.get_attribute_labels = get_attribute_labels;
