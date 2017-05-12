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
		let results = [];
		console.log('Recieved request to scrape', req.params.courseType)
		const pageSize = 100;
		const topic = req.params.courseType;
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
			let pageCount = Math.min(3, apiPages) //TODO: Reducing for testing purposes //
			console.log('There are ',pageCount, 'pages to scrape')
			const requests = [];
				for (var currPage = 0; currPage < pageCount; currPage++) {
					const pageQuery = new Promise((resolve, reject) => {
						axios.get(`https://www.udemy.com/api-2.0/courses?page=${currPage}&page_size=${pageSize}&language=en&ordering=highest-rated&category=${topic}`, {
							withCredentials: true,
							    auth: {
							      username: process.env.UDEMY_USERNAME,
							      password: process.env.UDEMY_PASSWORD
							    }
						})
						.then((res) => {resolve(res)})
						.catch((err) => {reject(err)})
					})
					requests.push(pageQuery)
				}
			return requests;

		})
		.then((apiRequests) => {
			//Process all of the API requests
			console.log('The promises for API calls are about to be run')
			Promise.all(apiRequests)
			.then((apiPages) => {
				//Populate the final data object with prelim data from API
				let courseArr = [];
				apiPages.forEach((page, index) => {
					const pageData = page.data.results;
					formatUdemy(pageData, topic, (cleanData) => {
						courseArr = courseArr.concat(cleanData)
					})
				})
				return courseArr;
			})
			.then((apiData) => {
				console.log('The API data has been collated and about to create crawling requests')
				//Create the crawling request promises
				const crawlStack = [];
				for (var i = 1; i < apiData.length - 1; i+= 2) {
					crawlStack.push(scrapeUdemyCourse(apiData[i].link, i ,apiData.length))
				}

				//Crawl all of the target pages and augment the API data
				Promise.all(crawlStack)
				.then((pages) => {
					console.log('The pages have been crawled')
					pages.forEach((page, i) => {
						const apiRef = i * 2 + 1;
						apiData[apiRef].description = descriptionTruncate(page[0]);
						apiData[apiRef].learnings = page[1];
						apiData[apiRef].duration = page[2];
					})
					return apiData;
				})
				.then((augmentedApiData) => {
					console.log('About to send the response')
					res.json(augmentedApiData)
				})
				.catch((error) => {
					console.log('There was an error in running the crawlers', error)
				})
			})
			.then((crawlStack) => {
				console.log('The crawlStack is', crawlStack)
			})
			.catch((err) => {
				console.log('Error in creating/running the request array', err)
			})
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

	axios.get('https://api.coursera.org/api/courses.v1')
	.then((res) => (res.data.paging.total)
	.then((courseCount = 0) => {
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