var db = require('../db/db.js')
var Course = require('../db/models/course.js')
var relevance = require('relevance');
var utilities = require('./utilities.js')

var heapdump = require('heapdump');

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
	process.kill(process.pid, 'SIGUSR2');
	var searchQuery = req.body.searchQuery;
	var splitQuery = searchQuery.trim().split(' ');
	
	//Create regex for the query
	var regexQuery = splitQuery.join("|");
	var re = new RegExp(regexQuery, 'ig');

	//Query with the regex
	Course.find({ $or: [
		{'description': re},
		{'title': re}
		]})
	.then(function(results){
		process.kill(process.pid, 'SIGUSR2');
		return relevance({
			query: splitQuery,
			data: results,
			rankings: {
			  title: 5,
			  description: 1
			}
		});
	})
	.then(function(results){
		process.kill(process.pid, 'SIGUSR2');
		res.send(JSON.stringify(results.slice(0,18)));
	})
}

// User.find( { $or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]}, 
//   function(err,docs){
//     if(!err) res.send(docs);
// });

