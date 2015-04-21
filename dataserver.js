var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var mongoose = require( 'mongoose' );

var monitorHandler = function(dbCol, socket) {
  var monitorAgent = { 
    init: function() {
      console.log('A monitor connected');
      socket.on('disconnect', function() {console.log('monitor disconnected'); });
      this.updateClock();
      this.sendHistoryData();
    },
    updateClock: function() {
      socket.emit('date', {'date': new Date()});
      setInterval(function() { socket.emit('date', {'date': new Date()});}, 5000);
    },
    sendHistoryData: function() {
      dbCol.count({}, function(err, count) {
        socket.emit('countDb', count);  
      });   
      var historyStream = dbCol.find().sort({_id : -1}).limit(5).stream();
      historyStream.on('data', function(pkt) {
        socket.emit('historyPkt', pkt);  
      })
    }
  };
  monitorAgent.init(); 
};

var feedHandler = function(dbCol, req, res) {
  var post_request_body = '';
  req.on('data', function (data) {
     post_request_body += data;
  });
  req.on('end', function (data) {
    var pkt;
    try {
      pkt = JSON.parse(post_request_body);
    } catch(e) {
      console.err(e);
    }
    io.sockets.emit('newPkt', pkt);  // Send event:newData to all monitors
    var lab2doc = new dbCol(pkt);
    lab2doc.save(function(err, lab2doc) {  // Save to db
      if (err)  return console.error(err);
      console.log("SAVE a document");
      res.send('Server GOT your data!');
    }); 
  });
};

var getLab2Collection = function() {
  var Lab2Schema = mongoose.Schema({
    date: Date,
    noise: Number,
    temparature: Number,
    humidity: Number,
    lat: Number,
    lng: Number
  });
  return mongoose.model('Lab2Collection', Lab2Schema);
}

server.listen(port, function() {
  console.log("Express server listening on port %d", server.address().port);
});
var mongodbUrl = (process.env.MONGOLAB_URI)? process.env.MONGOLAB_URI
    : 'mongodb://heroku_app35998051:nvjupt69fjpud7br66se29r23f@ds035167.mongolab.com:35167/heroku_app35998051';
// To use local database, change to this:
// var mongodbUrl = (process.env.MONGOLAB_URI)? process.env.MONGOLAB_URI : 'mongodb://localhost/test';  // for using local database
mongoose.connect(mongodbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error: '));
db.once('open', function (callback) {
  console.log("Database open");
  var Lab2Collection = getLab2Collection(mongoose);

  io.on('connection', function(socket) {  // connection setup for monitor.html
    monitorHandler(Lab2Collection, socket);
  });

  app.post('/feed', function(req, res) {
    feedHandler(Lab2Collection, req, res);
  });

  app.use(express.static('public'));
});





