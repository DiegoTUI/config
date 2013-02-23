/**
 * Requirements.
 */  
	var io = require('socket.io-client');
	var log = require('../util/log.js');
	var util = require('../util/util.js');
	var highResolutionTimer = util.highResolutionTimer;
	var debug = log.debug;
	var error = log.error;
	var info = log.info;
 
 /**
 * An annoying pinger.
 */
function pinger ()
{
	// self-reference
	var self = this;
	//connection
	var socket = io.connect('http://54.246.80.107:8080');
	//timer
	var timer = null;
	//timestamp
	var timestamp = null;
	//notification event
	socket.on("notification", function(data){
		info ("Notification: " + data);
	});
	//notification event
	socket.on("disconnected", function(data){
		info ("I've been disconnected. Stopping timer.");
		self.stop();
	});
	//pong event
	socket.on("pong", function(data){
		var delay = new Date().getTime() - timestamp;
		info ("Pong received: " + data.clientId + " - delay in ms: " + delay);
	})

	/**
	 * Ping!!
	 */
	 function ping()
	 {
	 	timestamp = new Date().getTime();
	 	info ("pinging at timestamp: " + timestamp);
	 	socket.emit("ping");
	 }

	/**
	 * Starts pinging with a given period
	 */
	self.start = function(period)
	{
		info ("Start function called");
		if (timer === null)
		{
			info ("Starting high resolution timer");
			timer = new highResolutionTimer(period, ping);
		}
	}
	/**
	 * Stops pinging
	 */
	self.stop = function()
	{
		timer.stop();
	}
}

module.exports.pinger = pinger;
//new pinger().start(100);