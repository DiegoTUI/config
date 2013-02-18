var io = require ('/etc/tuiinnovation/config/nodejs/node_modules/socket.io/lib/socket.io.js');

  var socket = io.connect('http://54.246.80.107:8080');
  
  function broadcastMessage()
  {
    console.log('Broadcasting message: ' + $('#textmessage').val());
	socket.emit('client',{message: $('#textmessage').val()});
	return false;
  }
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

broadcastMessage("you madafacka");
