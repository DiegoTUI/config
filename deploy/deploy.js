'use strict';

/**
 * Run a deployment.
 * (C) 2013 TuiInnovation.
 */

// requires
var child_process = require('child_process');
var Log = require('log');
var deploy = require('./deploy.js');
var test = require('../../mashoop/test.js');
// constants
var MASHOOP_DIRECTORY = '../mashoop';


/**
 * Run a deployment. Params:
 *	- log: an object to log messages.
 *	- callback(error, result): to be called with the final result.
 */
exports.run = function(log, callback) {
	// uncaught exceptions
	process.on('uncaughtException', function(err) {
		return callback('Uncaught exception: ' + err.stack);
	});
	log.info('Initiating...');
	var options = {
		cwd: MASHOOP_DIRECTORY,
	};
	child_process.exec('git pull', options, function(error, stdout, stderr) {
		if (error) {
			return callback('ERROR: git pull: ' + error + ', ' + stderr);
		}
		log.info('git pull: ' + stdout);
		child_process.exec('npm install', options, function(error, stdout, stderr) {
			if (error) {
				return callback('ERROR: npm install: ' + error + ', ' + stderr);
			}
			log.info('npm install: ' + stdout);
			runTests(log, callback);
		});
	});
}

/**
 * Run all package tsts.
 */
function runTests(log, callback) {
	test.test(function(error, result) {
		if (error) {
			return callback('ERROR: test: ' + error);
		}
		callback(false, result);
	});
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

