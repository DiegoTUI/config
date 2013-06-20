'use strict';

/**
 * Requirements.
 */
var fs = require('fs');
var express = require('express');
var httpRequest = require('request');

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
	//perform request to ATLAS
	httpRequest.post(atlas.url, {form:{xml_request:atlas.testRequest}}, function(error, httpResponse, body) {
		console.log ("received response from ATLAS: " + httpResponse.statusCode);
		response.setHeader("Content-Type", "text/plain");
		if (error) {
			response.send("An error occurred: " + JSON.stringify(error));
		} else {
			response.send("Response: " + body);
		}
	});
}
