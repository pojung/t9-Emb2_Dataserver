var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Express server listening on port %d", server.address().port);
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
