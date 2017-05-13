const ElasticSearch = require('./ElasticSearch.js')

//Only load environment variables if they exist
try {
    require('../env.js');
} catch (ex) {
	console.log('Environment variables file does not exist')
}
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
const routes = require('./routes');
const port = process.env.PORT || 9199

app.use(bodyParser.json({limit: '5mb', extended: true}))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/elastic', routes)
app.use('/*', (req, res) => {res.status(404).send('Route not found')})
// app.post('/search', handler.filteredCourses);

//Initialize es
// ElasticSearch.client.indices.create({ index: 'courses' })

//Set up listening
app.listen(port, function () {
  console.log(`ES router listening on port ${port}!`);
});