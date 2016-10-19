var rp = require('request-promise');
var Course = require('../db/models/course.js')

//TODO: inmplement truncate that limits the descriptions to 200 characters

exports.fetchUdacity = function() {
	//Get the data from Udacities API and convert into format for our database
	 rp('https://www.udacity.com/public-api/v0/courses')
	 .then(function(body) {
	 	var courseArr = [];
		var parsedBody = JSON.parse(body).courses;
		for (var i = 0; i < parsedBody.length; i++) {
			var shortCourse = {};

			shortCourse.platform = "udacity";
			shortCourse.title = parsedBody[i].title;
			shortCourse.description = parsedBody[i].short_summary;
			shortCourse.link = parsedBody[i].homepage;
			shortCourse.image = parsedBody[i].image
			shortCourse.difficulty = parsedBody[i].level;
			shortCourse.duration = parseInt(parsedBody[i].expected_duration) * 10 + ' hours';
			courseArr.push(shortCourse);
		}
	 	return courseArr;
	 })
	 .then(function(courseArr) {
	 	//Delete from the database where shortCourse.source = Udacity
	 	Course.find({source:"udacity"}).remove().exec();
	 	
	 	//Add new results into the database
	 	for (var i = 0; i < courseArr.length; i++) {
	 		Course.create(courseArr[i], function(err, course) {
	 			if (err) {
	 				console.log('there was an err', err)
	 			}
	 		})
	 	}
	 })
	 .catch(function(err) {
	 	console.log('there was an error', err);
	 })
}

exports.fetchCoursera = function(recursive, isEnd, start) {
	//Initialise and keep track of the pagination
	console.log("end", isEnd);
	if (start >= 0) {
		start = start + 100;
	} else {
		var start = 0;
	}
	var isEnd;
	//If we have reached the end of the pagination, return out of recursive calls
	if (isEnd === true) {
		return;
	} else {
		rp('https://api.coursera.org/api/courses.v1?start=' + start + '&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations,primaryLanguages')
		.then(function(body) {
			 	var courseArr = [];
				var parsedBody = JSON.parse(body);
				var courses = parsedBody.elements;
					isEnd = !(parsedBody.paging.next)

				for (var i = 0; i < courses.length; i++) {
					if (courses[i].primaryLanguages.indexOf('en') < 0 ) {continue;} ////If english is not the main language, skip this course
					var shortCourse = {};

					shortCourse.platform = 'coursera'
					shortCourse.title = courses[i].name;//var result = str;
					var matchedDesc = courses[i].description.match(/[^\.!\?]+[\.!\?]+/g)

					//
					if (matchedDesc) {
						shortCourse.description = matchedDesc.slice(0,2).toString().slice(0,300) + "..."
					} else {
						shortCourse.description = courses[i].description.split('.').slice(0,2).join('.').slice(0,300) + "..."
					}

					shortCourse.link = 'https://www.coursera.org/learn/' + courses[i].slug;
					shortCourse.image = courses[i].photoUrl
					shortCourse.difficulty = courses[i].specializations.length === 0 ? 'Anyone' : 'Check Course Site';
					shortCourse.duration = courses[i].workload;
					courseArr.push(shortCourse);
				}
			 	return courseArr;
		})
		.then(function(courseArr) {
				//Delete from the database where shortCourse.source = coursera (onlu when this is the first call)
				if (!recursive) {
					Course.remove({}, function(action) {
						console.log('The database has been cleared')
					})
				}
				
				//Add new results into the database
				for (var i = 0; i < courseArr.length; i++) {
					Course.create(courseArr[i], function(err, course) {
						if (err) {
							console.log('there was an err', err)
						}
					})
				}
		})
		.then(function() {
			return exports.fetchCoursera(true, isEnd, start)
		})
	}
}