//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const ElasticSearch = require('./ElasticSearch.js')
const routes = require('express').Router()

routes.get('/ping', (req, res) => {
    console.log('ping request recieved')
    ElasticSearch.ping(req, res);
});

routes.post('/index/init', (req, res) => {
    // [ 1 ] Create an index
    const index = req.body.index;
    console.log('The index to be created is', index)
    ElasticSearch.initIndex(req, res, index);
});

routes.post('/index/check', (req, res) => {
    //  [ 2 ] Check if Index exists
    const index = req.body.index;
    ElasticSearch.indexExists(req, res, index);
});
routes.post('/index/mapping', (req, res) => {
    //  [ 3 ] Preparing index and its mapping (basically setting data-types of each attributes and more)
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    ElasticSearch.initMapping(req, res, index, payload);
    return null;
});

routes.post('/add', (req, res) => {
    //  [ 4 ] Add data to index
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    const _id = req.body._id;
    const docType = req.body.type || 'misc';
    ElasticSearch.addDocument(req, res, index, _id, docType, payload);
    return null; 
});

routes.post('/update', (req, res) => {
    //  [ 5 ] Update a document
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    const _id = req.body._id;
    const docType = req.body.type || 'misc';
    ElasticSearch.updateDocument(req, res, index, _id, docType, payload);
    return null; 
});

routes.post('/search', (req, res) => {
    // [ 6 ] Search an index
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    const docType = req.body.type || 'misc';
    ElasticSearch.search(req, res, index, docType, payload);
});

routes.post('/delete-document', (req, res) => {
    //  Delete a document
    const index = req.body.index || 'courses';
    const _id = req.body._id;
    const docType = req.body.type || 'misc';
    ElasticSearch.deleteDocument(req, res, index, _id, docType);
    return null; 
});

routes.post('/delete_all', (req, res) => {
    ElasticSearch.deleteAll(req, res);
});

module.exports = routes;