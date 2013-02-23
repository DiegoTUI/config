/**
 * Requirements.
 */  
	var io = require('socket.io-client');
	var log = require('../util/log.js');
	var util = require('../util/util.js');
	var highResolutionTimer = util.highResolutionTimer;
	var randomId = util.randomId;
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
	self.socket = null;
	//timer
	self.timer = null;
	//timestamp
	self.timestamp = null;
	//auto-generated id of the pinger
	self.id = randomId();
	/**
	 * Ping!!
	 */
	 self.ping = function()
	 {
	 	self.timestamp = new Date().getTime();
	 	info ("pinging from id: " + self.socket.id);
	 	self.socket.emit("ping",{clientId: self.id});
	 }

	/**
	 * Starts pinging with a given period
	 */
	self.start = function(period)
	{
		info ("Start function called for id: " + self.id);
		if (self.socket === null)
		{
			info ("Connecting websocket");
			self.socket = io.connect('http://54.246.80.107:8080',{"force new connection" : true});
			//notification event
			self.socket.on("notification", function(data){
				info ("Notification: " + data);
			});
			//disconnected event
			self.socket.on("disconnected", function(data){
				info ("I've been disconnected. Stopping timer.");
				self.stop();
			});
			//pong event
			self.socket.on("pong", function(data){
				var delay = new Date().getTime() - self.timestamp;
				info ("Pong received: " + data.clientId + " - delay in ms: " + delay);
			});
		}
		if (self.timer === null)
		{
			info ("Starting high resolution timer");
			self.timer = new highResolutionTimer(period, self.ping);
		}
	}
	/**
	 * Stops pinging
	 */
	self.stop = function()
	{
		self.timer.stop();
	}
}

module.exports.pinger = pinger;
//new pinger().start(1000);