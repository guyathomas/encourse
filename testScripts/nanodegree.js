const response = require('./udacity.js')

const descriptionTruncate = function(description) {
	if (description.length > 300 ) {
		description = description.slice(0,300) + '...';
	}
	return description;
}

const formatUdacityN = function (courses, type) {
	const courseArr = [];
	for (var i = 0; i < courses.length; i++) {
		var shortCourse = {};
		shortCourse.platform = "udacity nanodegree";
		shortCourse.title = courses[i].title;
		if (shortCourse.title === "iOS Developer Nanodegree") {console.log(courses[i].expected_duration)}
		shortCourse.description = descriptionTruncate(courses[i].short_summary);
		shortCourse.link = courses[i].homepage;
		shortCourse.image = courses[i].image
		shortCourse.difficulty = courses[i].level;
		shortCourse.duration = courses[i].expected_duration + ' ' + courses[i].expected_duration_unit;
		courseArr.push({ "index" : { "_index" : "courses", "_type" : "udacity nanodegree" } });
		courseArr.push(shortCourse);
	}
	return courseArr;
}

console.log(formatUdacityN(response.courses))