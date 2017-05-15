const Promise = require("bluebird");
const axios = require('axios');
const format = require('./format')
const scrape = require('./scrapers')

const newestCache = {
	"udemy" : {}
};

//TODO: inmplement truncate that limits the descriptions to 200 characters

const addToDB = function (payload, platform) {
	// console.log('The payload to be posted', payload.length, 'items', JSON.stringify(payload))
	axios.post('http://elasticserver:9199/elastic/addAll', {
        "payload": payload,
        "platform": platform
  	})
  	.then((res) => {
  		console.log('Courses have been added to the DB')
  	})
  	.catch((err) => {
  		console.log('The error in posting the payload to the db')
  		// res.status(400).send('Error adding to DB')
  	})
}
const getUdemyAPIQueries = async function (topic, pageSize, pageCount) {
	//Will return an array of promises for all of the API calls
	return axios.get(`https://www.udemy.com/api-2.0/courses?page_size=1&language=en&ordering=newest&category=${topic}`, {
		withCredentials: true,
		    auth: {
		      username: process.env.UDEMY_USERNAME,
		      password: process.env.UDEMY_PASSWORD
		    }
	})
	.then((initRes) => {
		const apiQueries = [];
		const pagesInAPI = Math.ceil(parseInt(initRes.data.count) / pageSize)
		for (let currPage = 0; currPage < pagesInAPI; currPage++) {
			apiQueries.push(scrape.udemyAPI(currPage, pageSize, topic))
		}
		return apiQueries
	})
}

const scrapeUdemyPages = async function (shortData) {
	const scrapeRequests = [];
	for (var i = 0; i < shortData.length; i++) {
		const request = scrape.udemyPage(shortData[i].link)
		scrapeRequests.push(request);
	}

	return Promise.all(scrapeRequests)
	.then((pages) => {
		for (var i = 0; i < pages.length; i++) {
			const newData = pages[i];
			shortData[i].description = format.truncate(newData[0]);
			shortData[i].learnings = newData[1];
			shortData[i].duration = newData[2];
		}
		return shortData;
	})
	// GO through and add scrape requests to array
	//Run promise all and augment the existing data
	//

	// return shortData;
}

exports.udemy = async function (req, res) {
	// console.log('Recieved request')
	// const topic = req.params.topic ? [req.params.topic] : ["Academics","Business","Design","Development","Health & Fitness","IT & Software","Language","Lifestyle","Marketing","Music","Office Productivity","Personal Development","Photography","Teacher Training","Test Prep"]
	const topic = req.params.topic;
	const apiQueries = await getUdemyAPIQueries(topic, 100, 2);
	const progress = [];
	const parallelScrapes = 5;
	let newestID;
	let foundEnd = false;
	// console.log('apiQueries', apiQueries)
	
	const getCoursePages = (start, end, shortData, cb) => {
		const results = [];
		for (var i = start; i < end; i++) {
			if (shortData[i].platformID === newestCache.udemy[topic]) {
				break;
			} else {
				results.push(shortData[i])
			}
		}
		return results;
	}

	for (var i = 0; i < apiQueries.length && !foundEnd; i++) {
		let pageData = await apiQueries[i];
		pageData = pageData.data.results
		//Store the newest course ID in the temp cache to update after all queriest
		if (i === 0) { newestID = pageData[0].id; }

		const shortData = format.udemy(pageData, topic);
		for (var j = 0; j < shortData.length && !foundEnd; j += parallelScrapes) {
			const coursePages = getCoursePages(j, j + parallelScrapes, shortData);
			const finalData = await scrapeUdemyPages(coursePages);

			progress[i] = progress[i] ? (progress[i] + parallelScrapes) : parallelScrapes;
			console.log(progress);
			addToDB(finalData, 'udemy');
			if (coursePages.length < parallelScrapes) { foundEnd = true; }
		}
	}
	newestCache.udemy[topic] = newestID;
}

exports.udacity = function() {
	//Get the data from Udacities API and convert into format for our database
	 axios.get('https://www.udacity.com/public-api/v0/courses')
	 .then(function(res) {
		var data = res.data.courses;
		const formattedCourses = format.udacity(data, 'udacity')
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
				format.coursera(pageData, (cleanData) => {
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
