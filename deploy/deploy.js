'use strict';

/**
 * Run a deployment.
 * (C) 2013 TuiInnovation.
 */

// requires
var child_process = require('child_process');
var Log = require('log');
var util = require('util');
var path = require('path');
var loadtest = require('loadtest');
var deploy = require('./deploy.js');
// constants
var TEST_DIRECTORY = '../test/mashoop';
var DEPLOYMENT_DIRECTORY = '../mashoop';
var LOADTEST_PORT = 7357;
var LOADTEST_URL = 'http://localhost:' + LOADTEST_PORT + '/api/token/at-read-ticket-names?destination=BCN\&language=ENG';
var LOADTEST_REQUESTS = 1000;
var LOADTEST_MAX_LATENCY = 20;


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
	try {
		var modules = getTestModules();
		modules.test.test(function(error, result) {
		//fakeTest(function(error, result) {
		if (error) {
			return callback(error);
		}
		if (result && result.failure) {
			log.error('Tests failed: %s', result);
			return callback('Failure');
		}
		log.info('Test results: %s', result);
		// start app
		modules.app.startServer(LOADTEST_PORT, function() {
			loadTest(log, function(error, result) {
				modules.app.closeServer(function() {
					if (error) {
						return callback('Load tests failed: ' + error);
					}
					callback(false, 'Tests passed');
				});
			});
		});
		});
	}
	catch(exception) {
		callback('Could not run load tests: ' + exception);
	}
}

/**
 * Clean all paths, get the test modules.
 * Returns a structure with test and app attributes.
 */
function getTestModules() {
	var start = path.normalize(TEST_DIRECTORY);
	for (var cached in require.cache) {
		if (cached.contains(start)) {
			log.info('Cleaning up %s', cached);
			delete require.cache[cached];
		}
	}
	return {
		test: require('../' + TEST_DIRECTORY + '/test.js'),
		app: require('../' + TEST_DIRECTORY + '/lib/app.js'),
	};
}

/**
 * Run the load tests.
 */
function loadTest(log, callback) {
	// run load test
	var options = {
		url: LOADTEST_URL,
		concurrency: 10,
		maxRequests: LOADTEST_REQUESTS,
	};
	loadtest.loadTest(options, function(error, result) {
		if (error) {
			return callback('Load tests failed: ' + error);
		}
		log.info('Load test results: %s', util.inspect(result));
		var loadTestError = checkLoadTestError(result);
		if (loadTestError) {
			return callback(loadTestError);
		}
		callback(null);
	});
}

/**
 * Check if there is any error in load tests.
 * Returns null if everything OK, error otherwise.
 */
function checkLoadTestError(result) {
	if (!result) {
		return 'Empty load test results';
	}
	if (!result.totalRequests) {
		return 'No total requests in load test';
	}
	if (result.totalRequests != LOADTEST_REQUESTS) {
		return 'Missing requests in load test';
	}
	if (result.totalErrors) {
		return result.totalErrors + ' errors in load test';
	}
	if (!result.meanLatencyMs) {
		return 'No latency value in load test';
	}
	if (result.meanLatencyMs > LOADTEST_MAX_LATENCY) {
		return 'Too much latency in load test: ' + result.meanLatencyMs;
	}
	return null;
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


