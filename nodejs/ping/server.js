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
var maxClients = 3;
var connectedClients = [];
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
	if (connectedClients.length < maxClients)  //come on in
	{
		connectedClients.push(client);
		info ("New client connected: " + client.id + ". Total clients: " + connectedClients.length);
		client.send("hello");
	}
	else	//kick him out
	{
		client.disconnect();
	}
	
	client.on('disconnect', function(){
		info ("Client disconnected: " + client.id);});
 });

function sendMessage(message) {
        console.log('sending message: %s', message);
        io.sockets.emit('notification', {'message': message,time: new Date()});
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: "you are connected" });
  socket.on('client', function(data){
	console.log ('received a client message');
	sendMessage (data.message);
	});
});

