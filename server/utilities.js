const rp = require('request-promise');
const Course = require('../db/models/course.js')
const Promise = require("bluebird");
const axios = require('axios');

//TODO: inmplement truncate that limits the descriptions to 200 characters

const descriptionTruncate = function(description) {
	if (description.length > 300 ) {
		description = description.slice(0,300) + '...';
	}
	return description;
}

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
			shortCourse.description = descriptionTruncate(parsedBody[i].short_summary);
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
	 	Course.find({platform:"udacity"}).remove().exec();
	 	
	 	//Add new results into the database
	 	console.log('course length', courseArr.length)
	 	for (var i = 0; i < courseArr.length; i++) {
	 		Course.create(courseArr[i], function(err, course) {
	 			if (err) {
	 				console.log('there was an err', err)
	 			} else {
	 				console.log('Created course')
	 			}
	 		})
	 	}
	 })
	 .catch(function(err) {
	 	console.log('there was an error', err);
	 })
}

exports.fetchCoursera = function(recursive, isEnd, start) {

	let courseCount = 0;

	axios.get('https://api.coursera.org/api/courses.v1')
	.then((res) => { courseCount = res.data.paging.total })
	.then(() => {
		const requests = [];
		for (var query = 0; query < courseCount; query+= 100) {
			const pageQuery = new Promise((resolve, reject) => {
				axios.get(`https://api.coursera.org/api/courses.v1?start=${query}&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations,primaryLanguages`)
				.then((res) => {resolve(res)})
				.catch((err) => {reject(err)})
			})
			requests.push(pageQuery)
		}

		Promise.all(requests)
		.then((results) => {
			const courseArr = [];
			results.forEach((result) => {
				var courses = result.data.elements;

				for (var i = 0; i < courses.length; i++) {
					if (courses[i].primaryLanguages.indexOf('en') < 0 ) {continue;} ////If english is not the main language, skip this course
					var shortCourse = {};

					shortCourse.platform = 'coursera'
					shortCourse.title = courses[i].name;//var result = str;
					shortCourse.description = descriptionTruncate(courses[i].description);
					shortCourse.link = 'https://www.coursera.org/learn/' + courses[i].slug;
					shortCourse.image = courses[i].photoUrl || 'https://pbs.twimg.com/profile_images/579039906804023296/RWDlntRx.jpeg';
					shortCourse.difficulty = courses[i].specializations.length === 0 ? 'Anyone' : 'Check Course Site';
					shortCourse.duration = courses[i].workload;
					courseArr.push(shortCourse);
				}
			 	return courseArr;
			})

			Course.find({platform:'coursera'}).remove().exec();
			
			//Add new results into the database
			console.log('course length', courseArr.length)
			for (var i = 0; i < courseArr.length; i++) {
				Course.create(courseArr[i], function(err, course) {
					if (err) {
						console.log('there was an err', err)
					} else {
						console.log('Created course')
					}
				})
			}
		})
		.catch((err) => {
			console.log('Error in creating/running the request array', err)
		})
	})
	.catch((err) => {
		console.log('Error in getting number of courses', err)
	})

	// 	.then(function(body) {
	// 		 	var courseArr = [];
	// 			var parsedBody = JSON.parse(body);
	// 			var courses = parsedBody.elements;
	// 				isEnd = !(parsedBody.paging.next)

	// 			for (var i = 0; i < courses.length; i++) {
	// 				if (courses[i].primaryLanguages.indexOf('en') < 0 ) {continue;} ////If english is not the main language, skip this course
	// 				var shortCourse = {};

	// 				shortCourse.platform = 'coursera'
	// 				shortCourse.title = courses[i].name;//var result = str;
	// 				shortCourse.description = descriptionTruncate(courses[i].description)
	// 				shortCourse.link = 'https://www.coursera.org/learn/' + courses[i].slug;
	// 				shortCourse.image = courses[i].photoUrl
	// 				shortCourse.difficulty = courses[i].specializations.length === 0 ? 'Anyone' : 'Check Course Site';
	// 				shortCourse.duration = courses[i].workload;
	// 				courseArr.push(shortCourse);
	// 			}
	// 		 	return courseArr;
	// 	})
	// 	.then(function(courseArr) {
	// 			//Delete from the database where shortCourse.source = coursera (onlu when this is the first call)
	// 			if (!recursive) {
	// 				Course.remove({}, function(action) {
	// 					console.log('The database has been cleared')
	// 				})
	// 			}
				
	// 			//Add new results into the database
	// 			for (var i = 0; i < courseArr.length; i++) {
	// 				Course.create(courseArr[i], function(err, course) {
	// 					if (err) {
	// 						console.log('there was an err', err)
	// 					}
	// 				})
	// 			}
	// 	})
	// 	.then(function() {
	// 		return exports.fetchCoursera(true, isEnd, start)
	// 	})
	// }
}