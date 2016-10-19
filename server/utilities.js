var rp = require('request-promise');
var Course = require('../db/models/course.js')

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

exports.fetchCoursera = function(recursive, isEnd) {
	if (isEnd === true) {
		return;
	} else {
		rp('https://api.coursera.org/api/courses.v1?start=2200&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations')
		.then(function(body) {
			 	var courseArr = [];
				var parsedBody = JSON.parse(body);
				var courses = parsedBody.elements;
				var next = parsedBody.paging.next

				for (var i = 0; i < courses.length; i++) {
					var shortCourse = {};
					// shortCourse.source = "udacity";
					shortCourse.platform = 'coursera'
					shortCourse.title = courses[i].name;
					shortCourse.description = courses[i].description;
					shortCourse.link = 'https://www.coursera.org/learn/' + courses[i].slug;
					shortCourse.image = courses[i].photoUrl
					shortCourse.difficulty = courses[i].specializations === [] ? 'Beginner' : 'Check Course Site';
					shortCourse.duration = courses[i].workload;
					courseArr.push(shortCourse);
				}
			 	return courseArr;
		})
		.then(function(courseArr) {
				//Delete from the database where shortCourse.source = coursera (onlu when this is the first call)
				if (!recursive) {
					Course.find({source:"coursera"}).remove().exec();
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
	}
}