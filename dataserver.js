var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/', function(req, res) {
  res.send('Hello Wrold');
});

app.use(express.static('./'));

io.on('connection', function(socket) {
  setInterval(function() {
    socket.emit('date', {'date': new Date()});
  }, 1);
});
