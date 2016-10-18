var db = require('../db/db.js')
var Course = require('../db/models/course.js')
var relevance = require('relevance');
var utilities = require('./utilities.js')

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
	// utilities.fetchUdacity();
	var searchQuery = req.body.searchQuery
	var splitQuery = searchQuery.split
	console.log(req.body.searchQuery)
	Course.find()
	// .then(function(results){
	// 	query: ['html', 'css'],
	// 	data: data,
	// 	rankings: {
	// 	  title: 5,
	// 	  description: 1
	// 	}
	// })
	.then(function(results){
		res.send(JSON.stringify(results.slice(0,20)));
	})
}