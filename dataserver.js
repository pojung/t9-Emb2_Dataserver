var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log("Express server listening on port %d", server.address().port);
});

// set up mongoDB database
var mongoose = require( 'mongoose' );
var mongodbUrl = (process.env.MONGOLAB_URI)? process.env.MONGOLAB_URI : 'mongodb://heroku_app35998051:nvjupt69fjpud7br66se29r23f@ds035167.mongolab.com:35167/heroku_app35998051';
  // var mongodbUrl = (process.env.MONGOLAB_URI)? process.env.MONGOLAB_URI : 'mongodb://localhost/test';  // for using local database
mongoose.connect(mongodbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Database open");
  var Lab2Schema = mongoose.Schema({
    date: Date,
    noise: Number,
    temparature: Number,
    humidity: Number,
    lat: Number,
    lng: Number
  });
  var Lab2Collection = mongoose.model('Lab2Collection', Lab2Schema);

  io.on('connection', function(socket) {  // connection setup for monitor.js
    console.log('A monitor connected');
    var historyStream = Lab2Collection.find().sort({_id : -1}).limit(10).stream();
    historyStream.on('data', function(pkt) {
      socket.emit('historyPkt', pkt);  
    })
    setInterval(function() {
      socket.emit('date', {'date': new Date()});
    }, 2000);
    socket.on('disconnect', function() {
      console.log('monitor disconnected');
    });
  });

  app.get('/', function(req, res) {
    res.send('Use /feed.html to feed random data, and /monitor.html to observe it');
  });

  app.post('/feed', function(req, res) {
    // console.log('Got data fed!');
    var post_request_body = '';
    req.on('data', function (data) {
       post_request_body += data;
    });
    req.on('end', function (data) {
      // console.log('Send event:newData to all clients');
      var pkt = JSON.parse(post_request_body)
      io.sockets.emit('newPkt', pkt); 
      var lab2doc = new Lab2Collection(pkt);
      lab2doc.save(function(err, lab2doc) {
        if (err)  return console.error(err);
        console.log("SAVE a document");
        res.send('Server GOT your data!');
      }); 
    });
  });

  app.use(express.static('public'));
});





