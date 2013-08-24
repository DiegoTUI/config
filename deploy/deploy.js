'use strict';

/**
 * Run a deployment.
 * (C) 2013 TuiInnovation.
 */

// requires
var fs = require('fs');
var child_process = require('child_process');
var Log = require('log');
var deploy = require('./deploy.js');
// globals
var log = new Log('info');
// constants
var MASHOOP_DIRECTORY = '../mashoop';


/**
 * Run a deployment. Params:
 *	- show: a function to show messages.
 *	- callback(error, result): to be called with the final result.
 */
exports.run = function(show, callback) {
	show('Initiating...');
	var options = {
		cwd: MASHOOP_DIRECTORY,
	};
	child_process.exec('git pull', options, function(error, stdout, stderr) {
		if (error) {
			return callback('ERROR: git pull: ' + error + ', ' + stderr);
		}
		show('git pull: ' + stdout);
		callback(false, 'Success!');
	});
}

/**
 * Deploy when invoked directly.
 */
if (__filename == process.argv[1]) {
	exports.run(function(message) {
		log.info(message);
	}, function(error, result) {
		if (error) {
			log.error('Deployment failed: %s', error);
		}
		else {
			log.info('Deployment successful: %s', result);
		}
	});
}

