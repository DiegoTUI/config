
  var io = require('./io-client.js').io;
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
