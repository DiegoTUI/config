(function () {

var sys = require('sys'),
    utils = require('./socket.io-node/lib/socket.io/utils'),
    WebSocket = require('./socket.io-node/support/node-websocket-client/lib/websocket').WebSocket,
    EventEmitter = require('events').EventEmitter,
    io = {};
    
var Socket = io.Socket = function (host, options) {
  this.url = 'ws://' + host + ':' + options.port + '/socket.io/websocket';
  this.open = false;
  this.sessionId = null;
  this._heartbeats = 0;
  this.options = { origin: options.origin || 'http://forbind.net' };
};

Socket.prototype = new EventEmitter;

Socket.prototype.connect = function () {
  var self = this;
  
  function heartBeat() {
    self.send('~h~' + ++self._heartbeats);
  }
  
  this.conn = new WebSocket(this.url, 'borf', this.options);
  
  this.conn.onopen = function () {
    self.open = true;
    self.emit('connect');
  };
  
  this.conn.onmessage = function (event) {
    var rawmsg = utils.decode(event.data)[0],
        frame = rawmsg.substr(0, 3),
        msg;
        
    switch (frame){
      case '~h~':
        return heartBeat();
      case '~j~':
        msg = JSON.parse(rawmsg.substr(3));
        break;
    }

    if (msg !== undefined) {
      self.emit('message', msg);
    }
  };
  
  this.conn.onclose = function () {
    self.emit('disconnect');
    self.open = false;
  };
};

Socket.prototype.send = function (data) {
  if (this.open) {
    this.conn.send(utils.encode(data));
  }
};

Socket.prototype.disconnect = function () {
  if (this.open) {
    this.conn.close();
  }
};


this.io = exports.io = io;

})();

  var socket = new io.Socket ('localhost', 8080);
  
  function broadcastMessage()
  {
    console.log('Broadcasting message: ' + $('#textmessage').val());
	socket.emit('client',{message: $('#textmessage').val()});
	return false;
  }
  
  socket.on('connect', function () {
  console.log('yay, connected!');
  socket.send('hi there!');
});

  //Log first message for debugging purposes
  socket.on('news', function (data) {
    console.log(data);
  });
  // on every message recived we print the new datas inside the #container div
  socket.on('notification', function (data) {
    console.log ("updating labels...");
    console.log('Last Message: ' + data.message);
    console.log('Last Update: ' + data.time);
});

//broadcastMessage("you madafacka");

socket.connect();
