var mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/test' );
// mongoose.connect( 'mongodb://heroku_app35998051:nvjupt69fjpud7br66se29r23f@ds035167.mongolab.com:35167/heroku_app35998051' );

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("db open!");
  var kittySchema = mongoose.Schema({
    name: String
  });
  kittySchema.methods.speak = function() {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name"
    console.log(greeting);
  }
  var Kitten = mongoose.model('Kitten', kittySchema);
  var silence = new Kitten({ name: 'Silence' });
  console.log(silence.name);
  var fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak();
  fluffy.save(function (err, fluffy) {
    if (err) {
      return console.error(err);
    }
    console.log("SAVE!");
  });
  console.log("kittens in db:");
  Kitten.find(function(err, kittens) {
    if (err)  return console.log(err);
    console.log(kittens);
  })

});