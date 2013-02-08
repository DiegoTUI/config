var http = require('http');

var data = 'jajaja';

var server = http.createServer(function(req, res) {

  req
    .on('data', function(chunk) {
      data += chunk;
    })
    .on('end', function() {
      console.log('POST data: %s', data);
    })

  var onData = function(chunk) {
    console.log(chunk);
    //req.removeListener(onData);
  }

  onData('micarro');

  res.writeHead(500);
  //req.on('data',onData('me lo robaron'));
  res.end('Hello Http!!');
});
server.listen(8080);
