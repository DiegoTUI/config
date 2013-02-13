var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url')

app.listen(8080);

var message = '';

function handler (req, res) {
  // parse URL
  var requestURL = url.parse(req.url, true);
  console.log('requestURL');

  // if there is a message, send it
  if(requestURL.query.message){
	message = decodeURI(requestURL.query.message);
	sendMessage(message);
  }

  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function sendMessage(message) {
        console.log('sending message: %s', message);
        io.sockets.emit('notification', {'message': message,time: new Date()});
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: message });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

io.sockets.on('client', function(data){
	sendMessage (data.message);
});
