'use strict';

/**
 * Requirements.
 */
var fs = require('fs');
var express = require('express');
var httpRequest = require('request');
var requests = require('./requests.js');

/**
 * Constants.
 */
process.title = 'atlasProxy';

/**
 * Globals.
 */
var config = JSON.parse(fs.readFileSync("config.json"));
var atlas = require("./atlas.js");
//The app
var app = express();
//Serve root GET calls
app.get("/:service", serve);
//Listen
app.listen(config.port);
console.log("listening on port: " + config.port);

/**
 * HTTP server
 */
function serve (request, response) {
	console.log("Serving for " + request.params.service + " with query: " + JSON.stringify(request.query));
	//ok and nok callbacks
	function ok(result) {
		response.set("Content-Type", "text/plain");
		response.send(JSON.stringify(result));

	}
	function nok(error, statusCode) {
		response.status(statusCode).send(JSON.stringify(error));
	}
	//perform request to ATLAS
	if (typeof requests[request.params.service] === 'function') {
		var theRequest = new requests[request.params.service](request.query);
		theRequest.send(ok, nok);
	} else {
		nok();
	}
}
