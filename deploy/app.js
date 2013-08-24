'use strict';

/**
 * Run a server that listens for deployment requests.
 * (C) 2013 TuiInnovation.
 */

// requires
var Log = require('log');
var express = require('express');
var deploy = require('./deploy.js');
// globals
var log = new Log('info');
// constants
var PORT = 34107;
var TOKEN = '6xRrHTIU5Xr3e2Y3XWFT';
var MANUAL_TOKEN = 'manual';
process.title = 'deploy-listener';
// uncaught exceptions
process.on('uncaughtException', function(err) {
	log.error('Uncaught exception: %s', err.stack);
});

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
	var show = function(message) {
		log.info(message);
	};
	if (request.params.token == MANUAL_TOKEN) {
		show = function(message) {
			log.info(message);
			response.write(message + '\n');
		}
	}
	else if (request.params.token != TOKEN) {
		return response.status(500).send('Invalid request');
	}
	response.set('Content-Type', 'text/plain');
	show('Starting deployment...');
	deploy.run(show, function(error, result) {
		if (error) {
			show('Deployment failed: ' + error);
		}
		else {
			show('Deployment successful: ' + result);
		}
		response.end('Finished');
	});
}

/**
 * Fake deployment function.
 */
function run(show, callback) {
	show('Starting deployment');
	callback(null, 'Success!');
}

/**
 * Start server when invoked directly.
 */
if (__filename == process.argv[1]) {
	startServer();
}

