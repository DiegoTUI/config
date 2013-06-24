'use strict';
/*
 * TuiInnovation nodejs.
 * Ajax async calls.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

/**
 * object to encapsulate Ajax globals and functions.
 */
var ajax = new function()
{
	// self-reference
	var self = this;

	//requires
	var httpRequest = require('request');

	/**
	 * Function to submit data using Ajax, with instrumentation.
	 * ok: function to call with data after a success.
	 * nok: function to call with error object after a failure.
	 */
	self.send = function(data, url, ok, nok, method)
	{
		if (method === 'POST') {
			httpRequest.post(url, {form:data}, function(error, httpResponse, body) {
				console.log ("received response from ATLAS: " + httpResponse.statusCode);
				if (error || (httpResponse.statusCode!=="200")) {
					console.log ("sending NOK response");
					nok(error, httpResponse.statusCode);
				} else {
					console.log ("sending OK response");
					ok(body);
				}
			});	
		} else {
			httpRequest.get(url, {form:data}, function(error, httpResponse, body) {
				console.log ("received response from ATLAS: " + httpResponse.statusCode);
				if (error || (httpResponse.statusCode!=="200")) {
					nok(error, httpResponse.statusCode);
				} else {
					ok(body);
				}
			});
		}
	}
}

module.exports = ajax;
