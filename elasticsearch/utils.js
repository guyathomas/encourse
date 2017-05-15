module.exports = {
	addInstructions: function (data, platform, index = 'courses') {
		const newData = []
		// const dataPoints = data.length;
		for (var i = 0; i < data.length; i++) {
			newData.push({ "index" : { "_index" : index, "_type" : platform }});
			newData.push(data[i]);
		}
		console.log('AFter adding the instructions', newData)
		return newData;
	}
}