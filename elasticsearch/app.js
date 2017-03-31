//Only load environment variables if they exist
try {
    require('../env.js');
} catch (ex) {
	console.log('Environment variables file does not exist')
}
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/elastic', require('./routes'))
// app.post('/search', handler.filteredCourses);


//Set up listening
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});