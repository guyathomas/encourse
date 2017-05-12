//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const routes = require('express').Router()
const fetchers = require('./fetchers')

routes.get('/udemy/:courseType', (req, res) => {
	fetchers.udemy(req, res);
});
routes.get('/udacity', (req, res) => {
	console.log('Route does not exist yet!')
	res.status(400).send();
});
// routes.get('/udacitynano', (req, res) => {
// 	console.log('Route does not exist yet!')
// 	res.status(400).send();
// });
// routes.get('/coursera', (req, res) => {
// 	console.log('Route does not exist yet!')
// 	res.status(400).send();
// });
// routes.get('/edx', (req, res) => {
// 	console.log('Route does not exist yet!')
// 	res.status(400).send();
// });


module.exports = routes;