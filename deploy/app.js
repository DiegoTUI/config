'use strict';

/**
 * Run a server that listens for deployment requests.
 * (C) 2013 TuiInnovation.
 */

// requires
require('./prototypes.js');
var Log = require('log');
var util = require('util');
var express = require('express');
var deploy = require('./deploy.js');
var emailjs = require('emailjs');

// globals
var log = new Log('info');

// constants
var PORT = 34107;
var TOKEN = '6xRrHTIU5Xr3e2Y3XWFT';
var MANUAL_TOKEN = 'manual';

// init
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
	else {
		response.status(200).end('OK');
		// but continue processing
		show = new EmailLog();
	}
	var start = new Date();
	show.notice('Starting deployment at %s...', start.toISOString());
	deploy.run(show, function(error, result) {
		var end = new Date();
		var elapsed = (end.getTime() - start.getTime()) / 1000;
		show.notice('Ending deployment at %s, %s seconds elapsed', end.toISOString(), elapsed);
		var subject;
		if (error) {
			subject = 'Deployment failed: ' + error;
			show.error(subject);
		}
		else {
			subject = 'Deployment successful: ' + result;
			show.notice(subject);
		}
		if (show.close) {
			show.close(subject);
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
	self.priorities = {
		info: 'black',
		notice: 'black',
		error: 'red',
	};
	var bashColors = {
		'\u001b[32m': '<span style="color: green">',
		'\u001b[1;31m': '<span style="color: red">',
		'\u001b[0m': '</span>',
	};

	// init
	response.set('Content-Type', 'text/html');
	response.write('<html><head><title>Deployment</title></head><body>\n');
	response.write('<h1>Mashoop Deployment</h1>');
	for (var name in self.priorities) {
		self[name] = getShower(name, self.priorities[name]);
	}

	/**
	 * Get a function that shows the text in the given color, and prints to the log.
	 */
	function getShower(name, color) {
		return function(message) {
			message = util.format.apply(util, arguments);
			var replaced = message;
			for (var bash in bashColors) {
				if (replaced.contains(bash)) {
					replaced = replaced.replaceAll(bash, bashColors[bash]);
				}
			}
			response.write('<p style="color: ' + color + '">' + replaced + '</p>\n');
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
 * Log the results and email them.
 */
function EmailLog() {
	// self-reference
	var self = this;

	// attributes
	var response = new WebPageResponse();
	var webPage = new WebPageLog(response);
	var recipient = 'alejandrofer@gmail.com';
	var sender = 'alexfernandeznpm@gmail.com';
	var password = 'rsoWkVtbTn2U4Q';
	var host = 'smtp.gmail.com';

	// init
	for (var name in webPage.priorities) {
		self[name] = getStorer(name);
	}

	/**
	 * Get a function to store a message in the web page.
	 */
	function getStorer(name) {
		return function(message) {
			webPage[name].apply(webPage, arguments);
		};
	}

	/**
	 * Close web page and send.
	 */
	self.close = function(subject) {
		webPage.close();
		self.send(subject, response.contents);
	}

	/**
	 * Send an email with subject and contents.
	 */
	self.send = function(subject, contents) {
		log.info('Sending email to %s', recipient);
		var server = emailjs.server.connect({
			user:     sender,
			password: password,
			host:     host,
			ssl:      true,
		});
		var email = {
			text: 'This is a generated HTML email',
			from: sender,
			to: recipient,
			subject: subject,
			attachment: [ {
				data: contents,
				alternative: true,
			} ],
		};
		server.send(email, function(error, result)
		{
			if (error)
			{
				log.error('While sending an email: ' + error);
				return;
			}
			log.info('Email sent');
		});
	}
}

/**
 * A response that accumulates its input into a web page variable.
 */
function WebPageResponse() {
	// self-reference
	var self = this;

	// attributes
	self.contents = '';

	/**
	 * Ignore set.
	 */
	self.set = function() {
	}

	/**
	 * Write something to the web page.
	 */
	self.write = function(message) {
		self.contents += message;
	}
}

/**
 * Fake deployment function.
 */
function run(show, callback) {
	show.info('Starting fake deployment');
	// uncaught exceptions
	process.on('uncaughtException', function(err) {
		show.error('Uncaught exception: %s', err.stack);
	});
	return callback('error');
}

/**
 * Start server when invoked directly.
 */
if (__filename == process.argv[1]) {
	startServer();
}

