var mongoose = require('mongoose');
var db = require('../db.js');

//Schema
var courseSchema = new mongoose.Schema({
	platform: String,
	title: String,
	description: String,
	link: String,
	image: String,
	difficulty: String,
	duration: String
});

//Model
var Course = mongoose.model('Course', courseSchema);

module.exports = Course;