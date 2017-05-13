//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const routes = require('express').Router()
const fetchers = require('./fetchers')

routes.get('/udemy/:courseType', (req, res) => {
	fetchers.udemy(req, res);
});
routes.get('/udacity', (req, res) => {
	fetchers.udacity(req, res);
});
routes.get('/udacityNano', (req, res) => {
	fetchers.udacityNano(req, res);
});
routes.get('/coursera', (req, res) => {
	fetchers.coursera(req, res);
});
routes.get('/edx', (req, res) => {
	fetchers.edx(req, res);
});


module.exports = routes;