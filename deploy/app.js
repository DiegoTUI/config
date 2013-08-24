'use strict';

/**
 * Run a server that listens for deployment requests.
 * (C) 2013 TuiInnovation.
 */

// requires
var Log = require('log');
var util = require('util');
var express = require('express');
var deploy = require('./deploy.js');
// globals
var log = new Log('info');
// constants
var PORT = 34107;
var TOKEN = '6xRrHTIU5Xr3e2Y3XWFT';
var MANUAL_TOKEN = 'manual';
process.title = 'deploy-listener';

/**
 * Start server.
 */
function startServer() {
	var app = express();
	app.get('/deploy/:token', serve);
	app.listen(PORT);
	log.notice('Deployment server running on port %s', PORT);
}

/**
 * A deployment signal has arrived.
 */
function serve (request, response) {
	if (request.params.token == 'nop') {
		return response.status(200).send('NOP');
	}
	var show = log;
	if (request.params.token == MANUAL_TOKEN) {
		show = new WebPageLog(response);
	}
	else if (request.params.token != TOKEN) {
		return response.status(500).send('Invalid request');
	}
	show.notice('Starting deployment...');
	deploy.run(show, function(error, result) {
		if (error) {
			show.error('Deployment failed: ' + error);
		}
		else {
			show.notice('Deployment successful: ' + result);
		}
		if (show.close) {
			show.close();
		}
		response.end('Finished');
	});
}

/**
 * Log the results printing to a web page.
 */
function WebPageLog(response) {
	// self-reference
	var self = this;

	// attributes
	var priorities = {
		info: 'black',
		notice: 'black',
		error: 'red',
	}

	// init
	response.set('Content-Type', 'text/html');
	response.write('<html><head><title>Deployment</title></head><body>\n');
	response.write('<h1>Mashoop Deployment</h1>');
	for (var name in priorities) {
		self[name] = getShower(name, priorities[name]);
	}

	/**
	 * Get a function that shows the text in the given color, and prints to the log.
	 */
	function getShower(name, color) {
		return function(message) {
			response.write('<p style="color: ' + color + '>' + message + '</p>\n');
			// call legacy log
			var fn = log[name];
			fn.apply(log, arguments);
		};
	}

	/**
	 * Close the response.
	 */
	self.close = function() {
		response.write('</body></html>');
	}
}

/**
 * Fake deployment function.
 */
function run(show, callback) {
	show.info('Starting deployment');
	// uncaught exceptions
	process.on('uncaughtException', function(err) {
		show.error('Uncaught exception: %s', err.stack);
	});
	callback(null, 'Success!');
}

/**
 * Start server when invoked directly.
 */
if (__filename == process.argv[1]) {
	startServer();
}

