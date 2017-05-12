const descriptionTruncate = function(description) {
	if (description && description.length > 350 ) {
		description = description.slice(0,350) + '...';
	}
	return description;
}

exports.udemy = function (rawCoursePage, category, callback) {
	const courses = [];
	for (var i = 0; i < rawCoursePage.length; i++) {
		var shortCourse = {};
		// shortCourse.description = descriptionTruncate(rawCoursePage[i].description);
		// shortCourse.difficulty = rawCoursePage[i].specializations.length === 0 ? 'Anyone' : 'Check Course Site';
		// shortCourse.duration = rawCoursePage[i].workload;
		shortCourse.platform = 'udemy'
		shortCourse.title = rawCoursePage[i].title;//var result = str;
		shortCourse.link = 'https://www.udemy.com' + rawCoursePage[i].url;
		shortCourse.image = rawCoursePage[i].image_480x270 || rawCoursePage[i].image_240x135 || 'http://www.productivityme.co/wp-content/uploads/2015/06/9-On-Udemy.png';
		shortCourse.price = rawCoursePage[i].price
		shortCourse.platformID = rawCoursePage[i].id
		shortCourse.category = category
		courses.push({ "index" : { "_index" : "courses", "_type" : "udemy" } })
		courses.push(shortCourse);

	}
	callback(courses);
}

exports.coursera = function (rawCoursePage, callback) {
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

exports.udacity = function (courses, isNanodegree) {
	const courseArr = [];
	for (var i = 0; i < courses.length; i++) {
		var shortCourse = {};
		shortCourse.platform = isNanodegree? "udacity nanodegree" : "udacity"
		shortCourse.title = courses[i].title;
		shortCourse.description = descriptionTruncate(courses[i].short_summary);
		shortCourse.link = courses[i].homepage;
		shortCourse.image = courses[i].image
		shortCourse.difficulty = courses[i].level;
		shortCourse.duration = courses[i].expected_duration + ' ' + courses[i].expected_duration_unit;
		const instruction = { "index" : { "_index" : "courses", "_type" : (isNanodegree ? "udacity nanodegree" : "udacity") } }
		courseArr.push(instruction);
		courseArr.push(shortCourse);
	}
	return courseArr;
}