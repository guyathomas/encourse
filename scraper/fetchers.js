const rp = require('request-promise');
const Course = require('../db/models/course.js')
const Promise = require("bluebird");
const axios = require('axios');
const format = require('./format')

//TODO: inmplement truncate that limits the descriptions to 200 characters

const addToDB = function (payload) {
	console.log(payload)
	axios.post('http://elasticserver:9199/elastic/addAll', {
        "payload": payload
  	})
  	.then((res) => {
  		console.log('Courses have been added to the DB')
  	})
  	.catch((err) => {console.log('The error in posting the payload to the db')})
}

exports.fetchUdemy = function() {
	// const topics = ["Academics","Business","Design","Development","Health & Fitness","IT & Software","Language","Lifestyle","Marketing","Music","Office Productivity","Personal Development","Photography","Teacher Training","Test Prep"]
	const topics = ["Marketing"]
	topics.forEach((topic) => {
		axios.get('http://localhost:3002/scrape/udemy/' + topic)
		.then(function(res) {
			console.log('Recieved the response of scraped courses')
			addToDB(res.data)
		})
		.catch(function(err) {
			console.log('there was an creating/fetching udacity', err);
		})
	})
}

exports.fetchUdacity = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(res) {
		var data = res.data.courses;
		const formattedCourses = format.udacity(data)
	 	return formattedCourses;
	 })
	 .then(function(courseArr) {
	 	addToDB(courseArr)
	 })
	 .catch(function(err) {
	 	console.log('there was an creating/fetching udacity', err);
	 })
}

exports.fetchUdacityNano = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(res) {
		var data = res.data.degrees;
		const formattedCourses = format.udacity(data, true)
	 	return formattedCourses;
	 })
	 .then(function(courseArr) {
	 	addToDB(courseArr)
	 })
	 .catch(function(err) {
	 	console.log('there was an error creating/fetching udacity', err);
	 })
}

exports.fetchCoursera = function() {

	let courseCount = 0;

	axios.get('https://api.coursera.org/api/courses.v1')
	.then((res) => { courseCount = res.data.paging.total })
	.then(() => {
		const requests = [];
		for (var queryPage = 0; queryPage < courseCount; queryPage+= 100) {
			axios.get(`https://api.coursera.org/api/courses.v1?start=${queryPage}&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations,primaryLanguages`)
			.then((result) => {
				const pageData = result.data.elements;
				formatCoursera(pageData, (cleanData) => {
					addToDB(courseArr)
				})
			})
			.catch((err) => {
				console.log('Error in creating/running the request array', err)
			})
		}
	})
	.catch((err) => {
		console.log('Error in getting number of courses', err)
	})
}