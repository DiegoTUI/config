/**
 * TuiInnovation.
 * Fake unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var ParametrizedString = require("../ParametrizedString.js");

exports.undefinedParamString = function (test){
	var paramString = new ParametrizedString ();
	test.ok(typeof (paramString.replaceAll()) === 'undefined', 'empty parametrizedString returned undefined');
	test.ok(paramString.getLooseKeys().length === 0, 'empty parametrizedString returned empty loose keys');
    test.done();
}
