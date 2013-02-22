/**
 * Requirements.
 */  
	var io = require('socket.io-client');
	var log = require('../util/log.js');
	var debug = log.debug;
	var error = log.error;
	var info = log.info;
 
 /**
 * An annoying pinger.
 */
function pinger(period)
{
	// self-reference
	var self = this;
	//connection
	var socket = io.connect('http://54.246.80.107:8080');
	//connected event
	socket.on("hello", function(data){
		info ("Connected!!");
	});
}

new pinger(7);