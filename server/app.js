var express = require('express');
var app = express();
var handler = require('./reqHandler');
var bodyParser = require('body-parser')
var path = require('path');

// var cors = require('cors'); //tryint to fix 405 bad request
// app.use(cors());//tryint to fix 405 bad request


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   next();
// });

// app.options('*', cors()); //tryint to fix 405 bad request

// app.use(cors());
// console.log(__dirname)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../')));
// app.use(express.static('../index.html')); //Does not seem to be
app.post('/search', handler.filteredCourses);
app.get('/courses', handler.allCourses);
app.get('/courses/:provider', handler.courseByProvider);

app.get('/*', function(req, res){console.log('Missed the Get')});
app.post('/*', function(req, res){console.log('Missed the Post')});



//Set up listening
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});