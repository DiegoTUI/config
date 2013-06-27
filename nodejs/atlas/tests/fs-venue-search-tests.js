'use strict';
/**
 * TuiInnovation
 * FSVenueSearch unit tests
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var FSVenueSearch = require('../FSVenueSearch.js');

/* run tests */
exports.validVenueSearch = function (test) {
	function ok(result)
	{
		console.log("number of objects in the reply: " + result.venues.length);
		result.venues.forEach(function(venue){
			test.ok("id" in venue, "Element with no id retrieved: " + JSON.stringify(venue));
		});
		test.done();
	}

	function nok(error, statusCode)
	{
		var message = error ? 'test failed with status code ' + statusCode + ' and error: ' + JSON.stringify(error) : 
								'test failed with status code ' + statusCode;
		test.ok(false, message);
		test.done();
	}
	var parameters = {
		near: "Palma de Mallorca",
		intent: "browse",
		radius: "500"
	};

	var fsVenueSearch = new FSVenueSearch(parameters);
	ticketAvailRQ.sendRequest(ok, nok);
}
