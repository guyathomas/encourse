const res = require('./mockresponse.js')

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

formatUdemy(res, 'Development', (courses) => console.log(courses))