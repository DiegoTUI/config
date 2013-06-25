'use strict';
/**
 * TuiInnovation
 * Ajax unit tests
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/* run tests */
exports.offlineTest = function (test) {
	test.expect(1);
	function ok(result) {
		test.ok(false, "OK should never be called with a non-existing url");
		test.done();
	}

	function nok(error, statusCode)
	{
		test.ok(error.code === "EHOSTUNREACH", "wrong error returned: " + JSON.stringify(error));
		test.done();
	}

	var ajax = require('../ajax.js');
	ajax.send({},'http://212.170.239.72/appservices/http/FrontendService', ok, nok);
}

