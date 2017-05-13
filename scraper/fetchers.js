const rp = require('request-promise');
const Promise = require("bluebird");
const axios = require('axios');
const format = require('./format')
const scrape = require('./scrapers')

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
		let results = [];
		const pageSize = 100;
		//Determine how many requests will need to be made
		axios.get(`https://www.udemy.com/api-2.0/courses?page_size=1&language=en&ordering=highest-rated&category=${topic}`, {
			withCredentials: true,
			    auth: {
			      username: process.env.UDEMY_USERNAME,
			      password: process.env.UDEMY_PASSWORD
			    }
		})
		.then((initRes) => {
			//Create all of the promises for the requests
			const apiPages = Math.ceil(parseInt(initRes.data.count) / pageSize)
			let pageCount = 3//apiPages //Math.min(3, apiPages) //TODO: Reducing for testing purposes //
				for (let currPage = 0; currPage < pageCount; currPage++) {
					axios.get(`https://www.udemy.com/api-2.0/courses?page=${currPage}&page_size=${pageSize}&language=en&ordering=highest-rated&category=${topic}`, {
						withCredentials: true,
						    auth: {
						      username: process.env.UDEMY_USERNAME,
						      password: process.env.UDEMY_PASSWORD
						    }
					})
					.catch((err) => {console.log('Error in requestion page ' + currPage, err)})
					.then((page) => {
						let data;
						const pageData = page.data.results;
						format.udemy(pageData, topic, (cleanData) => {
							data = cleanData;
						})
						return data
					})
					.catch((err) => {console.log('Error in formatting the data', err)})
					.then((cleanData) => {
						for (var i = 1; i < cleanData.length - 2; i+= 2) {
							const apiRef = i * 2 + 1;
							if (cleanData[apiRef]) {
								scrape.udemy(cleanData[i].link, i ,cleanData.length)
								.then((page) => {
									cleanData[apiRef].description = format.truncate(page[0]);
									cleanData[apiRef].learnings = page[1];
									cleanData[apiRef].duration = page[2];
									return cleanData;
								})
								.then((completeData) => {
									addToDB(completeData)
								})
								.catch((err) => {console.log('Error in scraping the page', cleanData, err)})
							}
						}
					})
					.catch((err) => {console.log('Error in formatting the data', err)})
				}
		})
		.catch((err) => {console.log('Error in initial request', err)})
	})
}

// exports.fetchUdacity = function() {
// 	//Get the data from Udacities API and convert into format for our database
// 	 axios.get('https://www.udacity.com/public-api/v0/courses')
// 	 .then(function(res) {
// 		var data = res.data.courses;
// 		const formattedCourses = format.udacity(data)
// 	 	return formattedCourses;
// 	 })
// 	 .then(function(courseArr) {
// 	 	addToDB(courseArr)
// 	 })
// 	 .catch(function(err) {
// 	 	console.log('there was an creating/fetching udacity', err);
// 	 })
// }

// exports.fetchUdacityNano = function() {
// 	//Get the data from Udacities API and convert into format for our database
// 	 axios.get('https://www.udacity.com/public-api/v0/courses')
// 	 .then(function(res) {
// 		var data = res.data.degrees;
// 		const formattedCourses = format.udacity(data, true)
// 	 	return formattedCourses;
// 	 })
// 	 .then(function(courseArr) {
// 	 	addToDB(courseArr)
// 	 })
// 	 .catch(function(err) {
// 	 	console.log('there was an error creating/fetching udacity', err);
// 	 })
// }

// exports.fetchCoursera = function() {

// 	axios.get('https://api.coursera.org/api/courses.v1')
// 	.then((res) => (res.data.paging.total)
// 	.then((courseCount = 0) => {
// 		const requests = [];
// 		for (var queryPage = 0; queryPage < courseCount; queryPage+= 100) {
// 			axios.get(`https://api.coursera.org/api/courses.v1?start=${queryPage}&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations,primaryLanguages`)
// 			.then((result) => {
// 				const pageData = result.data.elements;
// 				formatCoursera(pageData, (cleanData) => {
// 					addToDB(courseArr)
// 				})
// 			})
// 			.catch((err) => {
// 				console.log('Error in creating/running the request array', err)
// 			})
// 		}
// 	})
// 	.catch((err) => {
// 		console.log('Error in getting number of courses', err)
// 	})
// }