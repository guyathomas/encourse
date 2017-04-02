const res = require('./mockresponse.js')
const Promise = require("bluebird");
const axios = require('axios');
const util = require('util');
const scrapeData = require('./scrapeData.js')

try {
    require('../env.js');
} catch (ex) {
	console.log('Environment variables file does not exist')
}
const descriptionTruncate = function(description) {
	if (description && description.length > 350 ) {
		description = description.slice(0,350) + '...';
	}
	return description;
}

const formatUdemy = function (rawCoursePage, category, callback) {
	const courses = [];
	for (var i = 0; i < rawCoursePage.length; i++) {
		var shortCourse = {};

		shortCourse.platform = 'udemy'
		shortCourse.title = rawCoursePage[i].title;//var result = str;
		// shortCourse.description = descriptionTruncate(rawCoursePage[i].description);
		shortCourse.link = 'https://www.udemy.com' + rawCoursePage[i].url;
		shortCourse.image = rawCoursePage[i].image_480x270 || rawCoursePage[i].image_240x135 || 'http://www.productivityme.co/wp-content/uploads/2015/06/9-On-Udemy.png';
		// shortCourse.difficulty = rawCoursePage[i].specializations.length === 0 ? 'Anyone' : 'Check Course Site';
		// shortCourse.duration = rawCoursePage[i].workload;
		shortCourse.price = rawCoursePage[i].price
		shortCourse.platformID = rawCoursePage[i].id
		shortCourse.category = category
		courses.push({ "index" : { "_index" : "courses", "_type" : "udemy" } })
		courses.push(shortCourse);
	}
	callback(courses);
}

module.exports = {
	udemy: function(req, res) {
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
					// crawlStack.push(scrapeData(apiData[i].link))
					crawlStack.push(scrapeData(apiData[i].link, i ,apiData.length))
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
	}
}