var mongoose = require('mongoose');
var db = require('../db.js');

//Schema
var courseSchema = new mongoose.Schema({
	title: String,
	description: String,
	// fullDescription: String, this is to ensure more relevant search results
	link: String,
	difficulty: String,
	duration: Number
});

//Model
var Course = mongoose.model('Course', courseSchema);

module.exports = Course;