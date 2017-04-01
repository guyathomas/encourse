const response = require('./udacity.js')

const descriptionTruncate = function(description) {
	if (description.length > 300 ) {
		description = description.slice(0,300) + '...';
	}
	return description;
}

Ad

console.log(formatUdacity(response.courses, true))