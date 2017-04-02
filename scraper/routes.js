//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const routes = require('express').Router()
const scrapers = require('./scrapers')

routes.get('/udemy/:courseType', (req, res) => {
	scrapers.udemy(req, res);
});

module.exports = routes;