// //Establish mongoose connection
// var mongoose = require('mongoose');

// console.log('The process.env.DB_URL is', process.env.DB_URL)
// mongoose.connect(process.env.DB_URL);

// //Establish handing for the connection
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected to MongoDB");
// });

// module.exports = db;