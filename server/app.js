//Only load environment variables if they exist
try {
    require('../env.js');
} catch (ex) {
	console.log('Environment variables file does not exist')
}

var express = require('express');
var app = express();
const axios = require('axios')
var handler = require('./reqHandler');
var bodyParser = require('body-parser')
var path = require('path');
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../')));

app.post('/search', handler.filteredCourses);

axios.get('localhost:3001/ping')
.then((res, err) => {
	if (err) {
		console.log('No Connection between ES and Web Service', err)
	} else {
		console.log('Web service can contact ES', res)
	}
})

//Set up listening
app.listen(port, function () {
  console.log(`Web server listening on port ${port}!`);
});