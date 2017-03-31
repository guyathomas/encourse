const ElasticSearch = require('./ElasticSearch.js')
const routes = require('express').Router()

routes.get('/ping', (req, res) => {
    console.log('ping request recieved')
    ElasticSearch.ping(req, res);
});

routes.post('/elastic/index/init', (req, res) => {
    // [ 1 ] Create an index
    var index = req.param('index_name');
    ElasticSearch.initIndex(req, res, index);
});

routes.post('/index/check', (req, res) => {
    //  [ 2 ] Check if Index exists
    var index = req.param('index_name');
    ElasticSearch.indexExists(req, res, index);
});
routes.post('/index/mapping', (req, res) => {
    //  [ 3 ] Preparing index and its mapping (basically setting data-types of each attributes and more)
    var payload = req.param('payload');
    var index = req.param('index_name');
    ElasticSearch.initMapping(req, res, index, payload);
    return null;
});

routes.post('/add', (req, res) => {
    //  [ 4 ] Add data to index
    var payload = req.param('payload');
    var index = req.param('index_name');
    var _id = req.param('_id');
    var docType = req.param('type');
    ElasticSearch.addDocument(req, res, index, _id, docType, payload);
    return null; 
});

routes.post('/update', (req, res) => {
    //  [ 5 ] Update a document
    var payload = req.param('payload');
    var index = req.param('index_name');
    var _id = req.param('_id');
    var docType = req.param('type');
    ElasticSearch.updateDocument(req, res, index, _id, docType, payload);
    return null; 
});

routes.post('/search', (req, res) => {
    // [ 6 ] Search an index
    var index = req.param('index_name');
    var payload = req.param('payload');
    var docType = req.param('type');
    ElasticSearch.search(req, res, index, docType, payload);
});

routes.post('/delete-document', (req, res) => {
    //  Delete a document
    var index = req.param('index_name');
    var _id = req.param('_id');
    var docType = req.param('type');
    ElasticSearch.deleteDocument(req, res, index, _id, docType);
    return null; 
});

routes.post('/delete_all', (req, res) => {
    ElasticSearch.deleteAll(req, res);
});

module.exports = routes;