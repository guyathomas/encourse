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
	udemy: function() {
		let results = [];
		// const topics = ["Academics","Business","Design","Development","Health & Fitness","IT & Software","Language","Lifestyle","Marketing","Music","Office Productivity","Personal Development","Photography","Teacher Training","Test Prep"]
		const topics = ["Development"]

		topics.forEach((topic) => {
			let courseCount = 0;
			axios.get('https://www.udemy.com/api-2.0/courses?page_size=1&language=en&ordering=highest-rated&category=' +topic, {
				withCredentials: true,
				    auth: {
				      username: process.env.UDEMY_USERNAME,
				      password: process.env.UDEMY_PASSWORD
				    }
			})
			.then((initRes) => {
				pageCount = 1/*changed for testing: res.data.count / 100*/;
				const requests = [];
					for (var currPage = 0; currPage < pageCount; currPage++) {
						const pageQuery = new Promise((resolve, reject) => {
							console.log(currPage)
							axios.get(`https://www.udemy.com/api-2.0/courses?page=${currPage}&page_size=${4/*100*/}&language=en&ordering=highest-rated&category=${topic}`, {
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
				Promise.all(apiRequests)
				.then((apiPages) => {
					let courseArr = [];
					apiPages.forEach((page, index) => {
						const pageData = page.data.results;
						formatUdemy(pageData, topic, (cleanData) => {
							courseArr = courseArr.concat(cleanData)
							// console.log(courseArr)
						})
					})
					return courseArr;
				})
				.then((apiData) => {
					const crawlStack = [];
					for (var i = 1; i < apiData.length - 1; i++, i++) {
						// crawlStack.push(scrapeData(apiData[i].link))
						crawlStack.push(scrapeData(apiData[i].link))
					}

					Promise.all(crawlStack)
					.then((pages) => {
						pages.forEach((page, i) => {
							const apiRef = i * 2 + 1;
							apiData[apiRef].description = page[0]
							apiData[apiRef].learnings = page[1]
							apiData[apiRef].duration = page[2]
							console.log('apiData[1]', apiData[apiRef])
						})
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
		//For each of the topics
			//Get the count of pages
			//Prepare an array of promises for each page
				//Make all of these requests
				//With the responses
					//Add the URL to the crawlStack
	}
}


// let courseCount = 0;

// axios.get('https://api.coursera.org/api/courses.v1')
// .then((res) => { courseCount = res.data.paging.total })
// .then(() => {
// 	const requests = [];
// 	for (var queryPage = 0; queryPage < courseCount; queryPage+= 100) {
// 		const pageQuery = new Promise((resolve, reject) => {
// 			axios.get(`https://api.coursera.org/api/courses.v1?start=${queryPage}&limit=100&fields=description,photoUrl,previewLink,workload,startDate,specializations,primaryLanguages`)
// 			.then((res) => {resolve(res)})
// 			.catch((err) => {reject(err)})
// 		})
// 		requests.push(pageQuery)
// 	}

// 	Promise.all(requests)
// 	.then((coursePages) => {
// 		let courseArr = [];
// 		coursePages.forEach((page, index) => {
// 			const pageData = page.data.elements;
// 			formatCoursera(pageData, (cleanData) => {
// 				courseArr = courseArr.concat(cleanData)
// 			})
// 		})
// 		addToDB(courseArr)
// 	})
// 	.catch((err) => {
// 		console.log('Error in creating/running the request array', err)
// 	})
// })
// .catch((err) => {
// 	console.log('Error in getting number of courses', err)
// })