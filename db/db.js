//Establish mongoose connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moocsearch');

//Establish handing for the connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

var courseSchema = mongoose.Schema({
	title: String,
	description: String,
	image: String,
	link: String,
	difficulty: String,
	duration: Number
})

var Course = mongoose.model('Course', courseSchema);

var androidUdacity = new Course({

	title: "Android Basics: Networking",
	description: "This class teaches the basics of networking using Android, and is a part of the Android Basics Nanodegree by Google.",
	image: "https://lh3.googleusercontent.com/Hp4UrpBlkIwM1VvtEOVAOaTZf9C6X0FXX0lKu3jllapJIlIw5hK_3tDzXamszoTC0PG_cswnx8y6EUl1aQ=s0#w=360&h=220",
	link: "https://www.udacity.com/course/android-basics-networking--ud843?utm_medium=referral&utm_campaign=api",
	difficulty: "Beginner",
	duration: 5
}).save();

Course.find(function(err, course) {
	if (err) {
		console.log(err);
	} else {
		console.log(course);
	}
})