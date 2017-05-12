// var db = require('../db/db.js')
var Course = require('../db/models/course.js')
var relevance = require('relevance');
var utilities = require('./utilities.js')
const axios = require('axios')

exports.allCourses = function (req, res) {
	//Get all of the courses from the db
	res.send('allCourses');
}

exports.elasticSearch = function (clientReq, clientRes) {
	// utilities.fetchCoursera(); //Don't delete
	// utilities.fetchUdacity(); //Don't delete
	// utilities.fetchUdacityNano(); //Don't delete
	// utilities.fetchUdemy();
	
	var searchQuery = clientReq.body.searchQuery;
	var resultCount = clientReq.body.resultCount || 50;

	axios.post('http://elasticserver:9199/elastic/search', {
		//TODO: Possibly use https://github.com/danpaz/bodybuilder to build this as the queries become more complex
		"payload": {
			"index": "courses",
			"body": {
		    "query": {
		          "query_string": {
		          	"fields": ["description", "title^4"],
		            "query": searchQuery + '*',
		            "analyze_wildcard": true
		          }
		        },
			"size": resultCount
			}
		}
	})
	.then((esRes, esErr) => {
		if (esErr) {
			console.log('No Connection between ES and Web Service', esErr)
		} else {
			console.log('Web service can contact ES')
			const pluckedData = esRes.data.hits.hits.map((hit) => {
				return hit._source;
			})
				clientRes.status(200).send(pluckedData)
		}
	})
	.catch((esErr) => {
		console.log('There was an error in the request to the ES server', esErr)
	})
}