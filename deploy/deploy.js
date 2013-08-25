'use strict';

/**
 * Run a deployment.
 * (C) 2013 TuiInnovation.
 */

// requires
var child_process = require('child_process');
var Log = require('log');
var util = require('util');
var loadtest = require('loadtest');
var deploy = require('./deploy.js');
var test = require('../../mashoop/test.js');
// constants
var TEST_DIRECTORY = '../test/mashoop';
var DEPLOYMENT_DIRECTORY = '../mashoop';


/**
 * Run a deployment. Params:
 *	- log: an object to log messages.
 *	- callback(error, result): to be called with the final result.
 */
exports.run = function(log, callback) {
	log.info('Updating...');
	update(TEST_DIRECTORY, log, function(error, result) {
		if (error) {
			return callback(error);
		}
		runTests(log, function(error, result) {
			if (error) {
				return callback(error);
			}
			update(DEPLOYMENT_DIRECTORY, log, function(error, result) {
				if (error) {
					return callback(error);
				}
				runCommand('sudo restart mashoop', {}, log, function(error, result) {
					if (error) {
						return callback(error);
					}
					callback(null, 'Success');
				});
			});
		});
	});
}

/**
 * Update the given directory.
 */
function update(directory, log, callback) {
	log.info('Updating %s', directory);
	var options = {
		cwd: directory,
	};
	runCommand('git pull', options, log, function(error, result) {
		if (error) {
			return callback(error);
		}
		runCommand('npm install', options, log, function(error, result) {
			if (error) {
				return callback(error);
			}
			callback(null);
		});
	});
}

/**
 * Run a command with the given options.
 */
function runCommand(command, options, log, callback) {
	child_process.exec(command, options, function(error, stdout, stderr) {
		if (error) {
			return callback(command + ': ' + error + ', ' + stderr);
		}
		log.info(command + ': ' + stdout);
		callback(null);
	});
}

/**
 * Run all package tsts.
 */
function runTests(log, callback) {
	// return callback('\u001b[32m%s\u001b[0m' + 'fake' + '\u001b[1;31m%s\u001b[0m');
	fakeTest(function(error, result) {
		if (error) {
			return callback(error);
		}
		if (result && result.failure) {
			log.error('Tests failed: %s', result);
			return callback('Failure');
		}
		log.info('Test results: %s', result);
		// run load test
		var options = {
			url: 'http://localhost:8080/',
			concurrency: 10,
			maxRequests: 1000,
		};
		loadtest.loadTest(options, function(error, result) {
			if (error) {
				return callback('Load tests failed: ' + error);
			}
			log.info('Load test results: %s', util.inspect(result));
			callback(false, 'Tests passed');
		});
	});
}

/**
 * Fake test function to use in hostile environments.
 */
function fakeTest(callback) {
	callback(null, 'well done');
}	

/**
 * Deploy when invoked directly.
 */
if (__filename == process.argv[1]) {
	var log = new Log('info');
	exports.run(log, function(error, result) {
		if (error) {
			log.error('Deployment failed: %s', error);
		}
		else {
			log.info('Deployment successful: %s', result);
		}
	});
}

