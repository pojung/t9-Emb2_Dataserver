var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require( 'mongoose' );

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Express server listening on port %d", server.address().port);
});

app.get('/', function(req, res) {
  res.send('Try /socket.html');
});

app.use(express.static('public'));

io.on('connection', function(socket) {
  console.log('A user connected');
  (function test1() {
    setInterval(function() {
    socket.emit('date', {'date': new Date()});
    }, 1);
    socket.on('chat', function(data) {
      console.log(data.date + ", " + data.content);
    });
  })();
  

  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

// mongo ds035167.mongolab.com:35167/heroku_app35998051 -u heroku_app35998051 -p nvjupt69fjpud7br66se29r23f
// mongodb://heroku_app35998051:nvjupt69fjpud7br66se29r23f@ds035167.mongolab.com:35167/heroku_app35998051

