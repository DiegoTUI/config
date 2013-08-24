'use strict';

/**
 * Run a deployment.
 * (C) 2013 TuiInnovation.
 */

// requires
var fs = require('fs');
var path = require('path');
var Log = require('log');
var express = require('express');
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
	callback(false, 'Success!');
}

/**
 * Deploy when invoked directly.
 */
if (__filename == process.argv[1]) {
	exports.run();
}

