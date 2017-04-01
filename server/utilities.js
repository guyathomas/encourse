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

const addToDB = function (payload) {
	axios.post('http://localhost:3001/elastic/addAll', {
        "payload": payload
  	})
  	.then((res) => {
  		console.log('After adding to the DB')
  	})
  	.catch((err) => {console.log('The error in adding payload to the db')})
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
		courses.push({ "index" : { "_index" : "courses", "_type" : "coursera" } })
		courses.push(shortCourse);
	}
	callback(courses);
}

const formatUdacity = function (courses) {
	console.log('in format udacity')
	const courseArr = [];
	for (var i = 0; i < courses.length; i++) {
		var shortCourse = {};
		if (courses[i].short_summary === undefined) {
			console.log('courses[i]', courses[i]); 
			throw new Error('whoops. courses is undefined')
		}
		shortCourse.platform = "udacity";
		shortCourse.title = courses[i].title;
		shortCourse.description = descriptionTruncate(courses[i].short_summary);
		shortCourse.link = courses[i].homepage;
		shortCourse.image = courses[i].image
		shortCourse.difficulty = courses[i].level;
		shortCourse.duration = parseInt(courses[i].expected_duration) * 10 + ' hours';
		courseArr.push({ "index" : { "_index" : "courses", "_type" : "udacity" } });
		courseArr.push(shortCourse);
	}
	return courseArr;
}

exports.fetchUdacity = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(res) {
		var data = res.data.courses;
		const formattedCourses = formatUdacity(data)
	 	return formattedCourses;
	 })
	 .then(function(courseArr) {
	 	addToDB(courseArr)
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
			coursePages.forEach((page, index) => {
				const pageData = page.data.elements;
				formatCoursera(pageData, (cleanData) => {
					courseArr = courseArr.concat(cleanData)
				})
			})
			addToDB(courseArr)
		})
		.catch((err) => {
			console.log('Error in creating/running the request array', err)
		})
	})
	.catch((err) => {
		console.log('Error in getting number of courses', err)
	})
}