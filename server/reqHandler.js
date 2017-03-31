var db = require('../db/db.js')
var Course = require('../db/models/course.js')
var relevance = require('relevance');
var utilities = require('./utilities.js')
const axios = require('axios')

exports.allCourses = function (req, res) {
	//Get all of the courses from the db
	res.send('allCourses');
}

exports.courseByProvider = function (req, res) {
	//Get all of the courses from the db
	res.send(req.params);
}

exports.filteredCourses = function (req, res) {
	// utilities.fetchCoursera(); //Don't delete
	// utilities.fetchUdacity(); //Don't delete

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
		res.send(JSON.stringify(results.slice(0,20)));
	})
}

exports.elasticSearch = function (req, res) {
	// utilities.fetchCoursera(); //Don't delete
	// utilities.fetchUdacity(); //Don't delete

	var searchQuery = req.body.searchQuery;
	console.log(splitQuery)

	axios.post('http://localhost:3001/elastic/search', {
    	"index": "courses",
    	"type": "coursera",
        "payload": {
        	"query": {
        		"match": {
            		"description": searchQuery,
            		"operator": "and"
        		}
        	}	
        }
  	})
	.then((res, err) => {
		if (err) {
			console.log('No Connection between ES and Web Service', err)
		} else {
			console.log('Web service can contact ES')
		}
	})
}