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

const createCourseFromArr = function (array) {
	for (var i = 0; i < array.length; i++) {
		Course.create(array[i], function(err, course) {
			if (err) {
				console.log('there was an err', err)
			} else {
				console.log('Created course')
			}
		})
	}
}

const formatCoursera = function (rawCoursePage, callback) {
	const courses = [];
	for (var i = 0; i < rawCoursePage.length; i++) {
		if (rawCoursePage[i].primaryLanguages.indexOf('en') < 0 ) {continue;} ////If english is not the main language, skip this course
		var shortCourse = {};

		shortCourse.platform = 'coursera'
		shortCourse.title = rawCoursePage[i].name;//var result = str;
		shortCourse.description = descriptionTruncate(rawCoursePage[i].description);
		shortCourse.link = 'https://www.coursera.org/learn/' + rawCoursePage[i].slug;
		shortCourse.image = rawCoursePage[i].photoUrl || 'https://pbs.twimg.com/profile_images/579039906804023296/RWDlntRx.jpeg';
		shortCourse.difficulty = rawCoursePage[i].specializations.length === 0 ? 'Anyone' : 'Check Course Site';
		shortCourse.duration = rawCoursePage[i].workload;
		courses.push(shortCourse);
	}
	callback(courses);
}

const formatUdacity = function (courses) {
	const courseArr = [];
	for (var i = 0; i < courses.length; i++) {
		var shortCourse = {};

		shortCourse.platform = "udacity";
		shortCourse.title = courses[i].title;
		shortCourse.description = descriptionTruncate(courses[i].short_summary);
		shortCourse.link = courses[i].homepage;
		shortCourse.image = courses[i].image
		shortCourse.difficulty = courses[i].level;
		shortCourse.duration = parseInt(courses[i].expected_duration) * 10 + ' hours';
		courseArr.push(shortCourse);
	}

	return courseArr;
}

exports.fetchUdacity = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(body) {
		var data = body.data.courses;
		const formattedCourses = formatUdacity(data)
	 	return formattedCourses;
	 })
	 .then(function(courseArr) {
	 	Course.find({platform:"udacity"}).remove().exec();
	 	createCourseFromArr(courseArr);
	 })
	 .catch(function(err) {
	 	console.log('there was an creating/fetching udacity', err);
	 })
}

exports.fetchCoursera = function(recursive, isEnd, start) {

	let courseCount = 0;

	axios.get('https://api.coursera.org/api/courses.v1')
	.then((res) => { courseCount = res.data.paging.total })
	.then(() => {
		const requests = [];
		for (var queryPage = 0; queryPage < courseCount; queryPage+= 100) {
			const pageQuery = new Promise((resolve, reject) => {
				axios.get(`https://api.coursera.org/api/courses.v1?start=${queryPage}&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations,primaryLanguages`)
				.then((res) => {resolve(res)})
				.catch((err) => {reject(err)})
			})
			requests.push(pageQuery)
		}

		Promise.all(requests)
		.then((coursePages) => {
			let courseArr = [];
			coursePages.forEach((page) => {
				const pageData = page.data.elements;
				formatCoursera(pageData, (cleanData) => {
					courseArr.push(cleanData)
				})
			})
			Course.find({platform:'coursera'}).remove().exec();
			createCourseFromArr(courseArr)
		})
		.catch((err) => {
			console.log('Error in creating/running the request array', err)
		})
	})
	.catch((err) => {
		console.log('Error in getting number of courses', err)
	})
}