/**
 * TuiInnovation.
 * Fake unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var ParametrizedString = require("../ParametrizedString.js");

var baseString = 'Hallo $who$. You $action$ my $relative$ $times$';

exports.undefinedParamString = function (test) {
	var paramString = new ParametrizedString ();
	test.ok(typeof (paramString.replaceAll()) === 'undefined', 'empty parametrizedString returned undefined');
	test.ok(paramString.getLooseKeys().length === 0, 'empty parametrizedString returned empty loose keys');
    test.done();
}

exports.exactMatch = function(test) {
	var params = {
			who: "peoples",
			action: "fuck",
			relative: "mother",
			times: "twice"
		};
	var paramString = new ParametrizedString (baseString, params);
	test.ok(paramString.replaceAll() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	test.ok(paramString.replaceAllClean() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	test.ok(paramString.getLooseKeys().length === 0, 'exact match. No loose keys');
}

exports.tooManyParams = function(test) {
	var params = {
		who: "peoples",
		action: "fuck",
		relative: "mother",
		times: "twice",
		extra1: "extra1",
		extra2: "extra2"
	};
	var paramString = new tuins.ParametrizedString (baseString, params);
	test.ok(paramString.replaceAll() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	test.ok(paramString.replaceAllClean() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	test.ok(paramString.getLooseKeys().length === 0, 'too many params. No loose keys');
}

exports.tooFewParams = function(test) {
	var params = {
		who: "peoples",
		action: "fuck",
		extra2: "extra2"
	};
	var paramString = new tuins.ParametrizedString (baseString, params);
	test.ok(paramString.replaceAll() == 'Hallo peoples. You fuck my $relative$ $times$', 'string replaced correctly');
	test.ok(paramString.replaceAllClean() == 'Hallo peoples. You fuck my  ', 'string replaced correctly');
	test.ok(paramString.getLooseKeys().length === 2, 'Should have 2 loose key');
}