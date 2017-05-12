//Only load environment variables if they exist
try {
    require('../env.js');
} catch (ex) {
	console.log('Environment variables file does not exist')
}

var express = require('express');
var app = express();
var handler = require('./reqHandler');
var bodyParser = require('body-parser')
var path = require('path');
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({limit: '10mb', extended: true}))

app.use(express.static(path.join(__dirname, '../')));

app.post('/search', handler.elasticSearch);
// app.post('/search', handler.filteredCourses);

//Create the empty index if it doesn't exist already
// handler.initElastic();

//Set up listening
app.listen(port, function () {
  console.log(`Web server listening on port ${port}!`);
});