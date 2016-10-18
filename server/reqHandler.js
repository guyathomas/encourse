var db = require('../db/db.js')
var Course = require('../db/models/course.js')
var relevance = require('relevance');

// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

exports.allCourses = function (req, res) {
	//Get all of the courses from the db
	res.send('allCourses');
}

exports.courseByProvider = function (req, res) {
	//Get all of the courses from the db
	res.send(req.params);
}

exports.filteredCourses = function (req, res) {
	var searchQuery = req.body.query
	console.log(req.body)
	Course.find()
	.then(function(results){
		// var sorted = relevance({
		//     query: searchQuery,
		//     data: results,
		//     rankings: {
		//       title: 5,
		//       description: 1
		//     }
		//   })
		// res.header('Access-Control-Allow-Origin', '*'); 
  //       res.header('Access-Control-Allow-Methods', 'GET, POST');
  //       res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.send("Test");
	})
}

// exports.defaultCorsHeaders = defaultCorsHeaders;