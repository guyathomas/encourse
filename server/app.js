var express = require('express');
var app = express();
var handler = require('./reqHandler')

// app.use(express.static('__dirname'));

// app.get('/', handler.test); TODO: show index.html
app.get('/', function(req, res) {
	res.send('This will be the status page')
})


app.get('/courses', handler.allCourses)
app.get('/courses/:provider', handler.courseByProvider)
app.get('/search/:query', handler.courseByProvider)



//Set up listening
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});