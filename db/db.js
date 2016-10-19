//Establish mongoose connection
var mongoose = require('mongoose');
var webUrl =  process.env.MONGOLAB_URI
var localUrl = 'mongodb://localhost/moocsearch'

mongoose.connect(localUrl);

//Establish handing for the connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

module.exports = db;