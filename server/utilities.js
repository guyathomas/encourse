var rp = require('request-promise');
var Course = require('../db/models/course.js')

exports.fetchUdacity = function() {
	 rp('https://www.udacity.com/public-api/v0/courses')
	 .then(function(body) {
	 	var courseArr = [];
		var parsedBody = JSON.parse(body).courses;
		for (var i = 0; i < parsedBody.length; i++) {
			var shortCourse = {};
			shortCourse.source = "udacity";
			shortCourse.title = parsedBody[i].title;
			shortCourse.description = parsedBody[i].short_summary;
			shortCourse.link = parsedBody[i].homepage;
			shortCourse.difficulty = parsedBody[i].level;
			shortCourse.duration = parsedBody[i].expected_duration;
			courseArr.push(shortCourse);
		}
	 	return courseArr;
	 })
	 .then(function(courseArr) {
	 	//Delete from the database where shortCourse.source = Udacity
	 	Course.find({source:"udacity"}).remove().exec();
	 	
	 	for (var i = 0; i < courseArr.length; i++) {
	 		Course.create(courseArr[i], function(err, course) {
	 			if (err) {
	 				console.log('there was an err', err)
	 			}
	 		})
	 	}

	 	//Create new modelss in the DB for each of the items in courseArr
	 	// console.log(courseArr);
	 })
	 .catch(function(err) {
	 	console.log('there was an error', err);
	 })

}


// Tank.create({ size: 'small' }, function (err, small) {
//   if (err) return handleError(err);
//   // saved!
// })