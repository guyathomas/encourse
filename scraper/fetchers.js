const Promise = require("bluebird");
const axios = require('axios');
const format = require('./format')
const scrape = require('./scrapers')

//TODO: inmplement truncate that limits the descriptions to 200 characters

const addToDB = function (payload, platform) {
	console.log('The payload to be posted', payload.length, 'items', JSON.stringify(payload))
	axios.post('http://elasticserver:9199/elastic/addAll', {
        "payload": payload,
        "platform": platform
  	})
  	.then((res) => {
  		console.log('Courses have been added to the DB')
  	})
  	.catch((err) => {
  		console.log('The error in posting the payload to the db', err)
  		// res.status(400).send('Error adding to DB')
  	})
}
const getUdemyAPIQueries = async function (topic, pageSize, pageCount) {
	//Will return an array of promises for all of the API calls
	return axios.get(`https://www.udemy.com/api-2.0/courses?page_size=1&language=en&ordering=highest-rated&category=${topic}`, {
		withCredentials: true,
		    auth: {
		      username: process.env.UDEMY_USERNAME,
		      password: process.env.UDEMY_PASSWORD
		    }
	})
	.then((initRes) => {
		const apiQueries = [];
		const pagesInAPI = Math.ceil(parseInt(initRes.data.count) / pageSize)
		for (let currPage = 0; currPage < pageCount; currPage++) {
			apiQueries.push(scrape.udemyAPI(currPage, pageSize, topic))
		}
		return apiQueries
	})
}

const scrapeUdemyPage = async function (shortData) {
	const newData = await scrape.udemyPage(shortData.link)
	shortData.description = format.truncate(newData[0]);
	shortData.learnings = newData[1];
	shortData.duration = newData[2];
	return shortData;
}

exports.udemy = async function (req, res) {
	// const topic = req.params.topic ? [req.params.topic] : ["Academics","Business","Design","Development","Health & Fitness","IT & Software","Language","Lifestyle","Marketing","Music","Office Productivity","Personal Development","Photography","Teacher Training","Test Prep"]
	const topic = req.params.topic;
	const apiQueries = await getUdemyAPIQueries(topic, 100, 2);
	const progress = [];
	const parallelScrapes = 10;
	// console.log('apiQueries', apiQueries)

	for (var i = 0; i < apiQueries.length; i++) {
		// console.log('API Page',i);
		let pageData = await apiQueries[i];
		pageData = pageData.data.results
		// console.log('pageData.data', pageData)
		const shortData = format.udemy(pageData, topic);
		const finalArr = [];
		for (var j = 0; j < shortData.length; j++) {
			const finalItem = await scrapeUdemyPage(shortData[j])
			finalArr.push(finalItem)
			progress[i] = progress[i] ? progress[i] + 1 : 1;
			console.log(progress);
		}
		addToDB(finalArr, 'udemy');
	}
}
// exports.udemy = function(req, res) {

// 	let topics;
// 	let pageCount = 2;
// 	const pageSize = 2;
// 	if (req.params.courseType) {
// 		topics = [req.params.courseType]
// 	} else {
		
// 	}
// 	console.log('Recieved the scrape request');
// 	topics.forEach((topic) => {
// 		//Determine how many requests will need to be made


// 					// console.log('Will make the API request with', 'currPage', currPage, 'pageSize', pageSize)
// 					axios.get(`https://www.udemy.com/api-2.0/courses?page=${currPage}&page_size=${pageSize}&language=en&ordering=highest-rated&category=${topic}`, {
// 						withCredentials: true,
// 						    auth: {
// 						      username: process.env.UDEMY_USERNAME,
// 						      password: process.env.UDEMY_PASSWORD
// 						    }
// 					})
// 					.catch((err) => {console.log('Error in requestion page ' + currPage, err)})
// 					.then((page) => {
// 						console.log('Made the API request with', 'currPage', currPage, 'pageSize', pageSize)
// 						let data;
// 						const pageData = page.data.results;
// 						format.udemy(pageData, topic, (cleanData) => {
// 							data = cleanData;
// 						})
// 						console.log('TEST: the output of udemy', data)
// 						return data
// 					})
// 					.catch((err) => {console.log('Error in formatting the data', err)})
// 					.then((cleanData) => {
// 						for (let i = 1; i < cleanData.length; i+= 2) {
// 							scrape.udemy(cleanData[i].link, i ,cleanData.length)
// 							.then((page) => {
// 								cleanData[i].description = format.truncate(page[0]);
// 								cleanData[i].learnings = page[1];
// 								cleanData[i].duration = page[2];
// 								return cleanData;
// 							})
// 							.then((completeData) => {
// 								addToDB(completeData)
// 							})
// 							.catch((err) => {console.log('Error in scraping the page', cleanData, err)})
// 						}
// 					})
// 					.catch((err) => {console.log('Error in formatting the data', err)})
// 				}
// 		})
// 		.catch((err) => {
// 			console.log('Error in initial request', err)
// 			// res.status(400).send('Error in scrape')
// 		})
// 	})
// 	.then(() => res.status(200).send('Scrape complete'))
// }

exports.udacity = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(res) {
		var data = res.data.courses;
		const formattedCourses = format.udacity(data)
	 	return formattedCourses;
	 })
	 .then(function(courseArr) {
	 	addToDB(courseArr, 'udacity')
	 })
	 .then(() => res.status(200).send('Scrape complete'))
	 .catch(function(err) {
	 	console.log('there was an creating/fetching udacity', err);
	 	res.status(400).send('Error in scrape')
	 })
}

exports.udacityNano = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(res) {
		var data = res.data.degrees;
		const formattedCourses = format.udacity(data, 'udacity nanodegree')
	 	return formattedCourses;
	 })
	 .then(function(courseArr) {
	 	addToDB(courseArr, 'udacity nanodegree')
	 })
	 .then(() => res.status(200).send('Scrape complete'))
	 .catch(function(err) {
	 	console.log('there was an error creating/fetching udacity', err);
	 	res.status(400).send('Error in scrape')
	 })
}

exports.coursera = function() {

	axios.get('https://api.coursera.org/api/courses.v1')
	.then((res) => (res.data.paging.total))
	.then((courseCount) => {
		courseCount = courseCount || 0;
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
	.then(() => res.status(200).send('Scrape complete'))
	.catch((err) => {
		console.log('Error in getting number of courses', err);
		res.status(400).send('Error in scrape')
	})
}
