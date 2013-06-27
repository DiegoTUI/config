'use strict';

/**
 * Requirements.
 */
var fs = require('fs');
var express = require('express');
var requests = require('./requests.js');
var log = require('./log.js');

/**
 * Constants.
 */
process.title = 'tuiMashup';

/**
 * Globals.
 */
var config = JSON.parse(fs.readFileSync("./config.json"));
var atlas = require("./atlas.js");
//The app
var app = express();
//Serve root GET calls
app.get("/:service", serve);
//Listen
app.listen(config.port);
log.info("listening on port: " + config.port);

/**
 * HTTP server
 */
function serve (request, response) {
	log.info("Serving for " + request.params.service + " with query: " + JSON.stringify(request.query));
	//ok and nok callbacks
	function ok(body) {
		response.set("Content-Type", "text/plain");
		response.send(JSON.stringify(body));

	}
	function nok(error, statusCode) {
		//response.set("Content-Type", "text/html");
		response.status(statusCode).send(JSON.stringify(error));
	}
	//perform request to ATLAS
	if (typeof requests[request.params.service] === 'function') {
		var theRequest = new requests[request.params.service](request.query);
		theRequest.sendRequest(ok, nok);
	} else {
		log.info("service " + request.params.service + " not found");
		nok({error:"service not found"}, 404);
	}
}
