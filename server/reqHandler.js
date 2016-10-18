var db = require('../db/db.js')
var Course = require('../db/models/course.js')
var relevance = require('relevance');

exports.allCourses = function (req, res) {
	//Get all of the courses from the db
	res.send('allCourses');
}

exports.courseByProvider = function (req, res) {
	//Get all of the courses from the db
	res.send(req.params);
}

exports.filteredCourses = function (req, res) {
	var searchQuery = req.params.query
	Course.find()
	.then(function(results){
		var sorted = relevance({
		    query: searchQuery,
		    data: results,
		    rankings: {
		      title: 5,
		      description: 1
		    }
		  })
		res.send(JSON.stringify(sorted.slice(0,10)))
	})
}


$regex : ".*son.*"