//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const routes = require('express').Router()
const scrapers = require('./scrapers')

routes.get('/udemy/:courseType', (req, res) => {
	scrapers.udemy(req, res);
});

// routes.post('/index/init', (req, res) => {
    // // [ 1 ] Create an index
    // const index = req.body.index;
    // ElasticSearch.initIndex(req, res, index);
// });

module.exports = routes;