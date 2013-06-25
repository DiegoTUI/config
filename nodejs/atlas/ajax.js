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
		var requestMethod = method === 'POST' ? httpRequest.post : httpRequest.get;
		requestMethod (url, {form:data}, function(error, httpResponse, body) {
			if (error) { //there was an error
				console.log("Error for url " + url + ": " + JSON.stringify(error));
				nok(error, 500);
			} else { //No error, let's look at the statusCode
				console.log ("received response from ATLAS: " + httpResponse.statusCode);
				if (httpResponse.statusCode != 200) {
					nok({error:body}, httpResponse.statusCode);
				} else {
					//Check if the error is coded in the response
					console.log ("sending OK response");
					ok(body);
				}
			}
		});
		/*
		if (method === 'POST') {
			httpRequest.post(url, {form:data}, function(error, httpResponse, body) {
				if (httpResponse === undefined) { //timeout, url non existing
					console.log("Timeout for url " + url + ". Returned: " + JSON.stringify(error) + " and " + body);
					nok({error: "Request timeout for url " + url}, 504);
				}
				console.log ("received response from ATLAS: " + httpResponse.statusCode);
				if (error || (httpResponse.statusCode != 200)) {
					console.log ("sending NOK response");
					nok({error:body}, httpResponse.statusCode);
				} else {
					//Check if the error is coded in the response
					console.log ("sending OK response");
					ok(body);
				}
			});	
		} else {
			httpRequest.get(url, {form:data}, function(error, httpResponse, body) {
				console.log ("received response from ATLAS: " + httpResponse.statusCode);
				if (error || (httpResponse.statusCode != 200)) {
					console.log ("sending NOK response");
					nok({error:body}, httpResponse.statusCode);
				} else {
					console.log ("sending OK response");
					ok(body);
				}
			});
		}*/
	}

}

module.exports = ajax;
