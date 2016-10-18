var db = require('../db/db.js')
var Course = require('../db/models/course.js')

exports.allCourses = function (req, res) {
	//Get all of the courses from the db
	res.send('allCourses');
}

exports.courseByProvider = function (req, res) {
	//Get all of the courses from the db
	res.send(req.params);
}

exports.filteredCourses = function (req, res) {
	var query = {
		$or: req.params.search
	}

	Course.find()
		.where(query)
		.then(function(data) {
			res.send(JSON.stringify(data));
		})
}