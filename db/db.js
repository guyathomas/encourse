//Establish mongoose connection
var mongoose = require('mongoose');

console.log('process.env.DB_URL', process.env.DB_URL)
mongoose.connect(process.env.DB_URL);

//Establish handing for the connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

module.exports = db;