//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const routes = require('express').Router()

routes.get('/start:type', (req, res) => {
});

// routes.post('/index/init', (req, res) => {
    // // [ 1 ] Create an index
    // const index = req.body.index;
    // ElasticSearch.initIndex(req, res, index);
// });

module.exports = routes;