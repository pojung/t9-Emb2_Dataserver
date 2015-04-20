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

app.get('/monitor.html', function(req, res, next) {
  io.on('connection', function(socket) {
    console.log('A monitor connected');
    setInterval(function() {
      socket.emit('date', {'date': new Date()});
    }, 40);  
    socket.on('disconnect', function() {
      console.log('monitor disconnected');
    });
  });
  next();
});

app.post('/feed', function(req, res) {
  // console.log('Got data fed!');
  var post_request_body = '';
  req.on('data', function (data) {
     post_request_body += data;
  });
  req.on('end', function (data) {
    // console.log('Send event:newData to all clients');
    io.sockets.emit('newData', JSON.parse(post_request_body));  
  });
  res.send('Server GOT your data!');
});

app.use(express.static('public'));


// mongo ds035167.mongolab.com:35167/heroku_app35998051 -u heroku_app35998051 -p nvjupt69fjpud7br66se29r23f
// mongodb://heroku_app35998051:nvjupt69fjpud7br66se29r23f@ds035167.mongolab.com:35167/heroku_app35998051

