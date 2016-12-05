require('../env.js');
var express = require('express');
var app = express();
var handler = require('./reqHandler');
var bodyParser = require('body-parser')
var path = require('path');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../')));

app.post('/search', handler.filteredCourses);
// app.get('/courses', handler.allCourses);
// app.get('/courses/:provider', handler.courseByProvider);

//Set up listening
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});