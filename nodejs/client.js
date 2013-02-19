  
  var io = require('socket.io-client');
  
  var socket = io.connect('http://54.246.80.107:8080');
  
  function broadcastMessage()
  {
    console.log('Broadcasting message: ' + $('#textmessage').val());
	socket.emit('client',{message: $('#textmessage').val()});
  }
  //Log first message for debugging purposes
  socket.on('news', function (data) {
    console.log(data);
  });
  // on every message recived we print the new datas inside the #container div
  socket.on('notification', function (data) {
    console.log ("updating labels...");
    $('#container').html('Last Message: ' + data.message);
    $('#time').html('Last Update: ' + data.time);
  });
  
 broadcastMessage("Holy Crap");
