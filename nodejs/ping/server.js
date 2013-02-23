'use strict';

/**
 * Requirements.
 */
var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var url = require('url');
var log = require('./util/log.js');
var debug = log.debug;
var info = log.info;
var error = log.error;

/**
 * Constants.
 */
process.title = 'pinger';

/**
 * Globals.
 */
var port = 8080;
var maxClients = 2;
var connectedClients = {
	clients:[],
	length: function(){
		return Object.keys(this.clients).length;
		}
};
var server = http.createServer(serve).listen(port, function() {
	info('Server running at http://127.0.0.1:' + port + '/');
});
var wsServer = io.listen(server);

/**
 * HTTP server
 */
function serve (request, response) {
  // parse URL
  var requestURL = url.parse(req.url, true);
 
  //check the max number of connections allowed
  if(requestURL.query.message){
	message = decodeURI(requestURL.query.message);
	sendMessage(message);
  }
}

/**
 *  This callback function is called every time someone
 *   tries to connect to the WebSocket server
 */
 wsServer.on("connection", function(client){
	//Check if the connection is allowed
	if (connectedClients.length() < maxClients)  //come on in
	{
		connectedClients.clients[client.id] = client;
		info ("New client connected: " + client.id + ". Total clients: " + connectedClients.length() + ". Max clients allowed: " + maxClients);
		client.emit("notification", "Welcome, you are now connected");
	}
	else	//kick him out
	{
		info ("Total clients: " + connectedClients.length() + ". Max clients allowed: " + maxClients + ". Kicking out!!");
		client.emit("notification", "Too many connections, you are being kicked out");
		client.disconnect();
	}
	
	client.on('disconnect', function(){
		delete connectedClients[client.id];
		info ("Client disconnected: " + client.id);});

	client.on("ping", function(data){
 	info ("Ping received from: " + data.clientId);
 	connectedClients.clients[client.id].emit("pong", "ponging I am");
 	info ("Pong emmited for: " + data.clientId);
 	});
 });

 /**
 *  This callback function is called every time someone
 *   pings to the websocket server
 */
 wsServer.on("ping", function(data){
 	info ("Ping received from: " + data.clientId);
 	connectedClients.clients[client.id].emit("pong", "ponging I am");
 	info ("Pong emmited for: " + data.clientId);
 });
	


