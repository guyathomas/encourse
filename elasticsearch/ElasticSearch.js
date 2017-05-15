//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
  	host: 'elastic:9200',
  	log: 'trace',
  	httpAuth: 'elastic:changeme'
});

module.exports = {
	client: elasticClient,
	ping: function(req, res){
		elasticClient.ping({
		  	requestTimeout: 30000,
		}, function (error) {
			if (error) {
				res.status(500)
			    return res.json({status: false, msg: 'Elasticsearch cluster is down!'})
			} else {
			    res.status(200);
			    return res.json({status: true, msg: 'Success! Elasticsearch cluster is up!'})
			}
		});
	},

	// 1. Create index
	initIndex: function(req, res, indexName){

	    elasticClient.indices.create({
	        index: indexName
	    }).then(function (resp) {
	        res.status(200)
	        return res.json(resp)
	    }, function (err) {
	        res.status(500)
	        return res.json(err)
	    });
	},
	
	// 2. Check if index exists
	indexExists: function(req, res, indexName){
	    elasticClient.indices.exists({
	        index: indexName
	    }).then(function (resp) {
	        res.status(200);
	        return res.json(resp)
	    }, function (err) {
	        res.status(500)
	        return res.json(err)
	    });
	},

	// 3.  Preparing index and its mapping
	initMapping: function(req, res, indexName, docType, payload){

	    elasticClient.indices.putMapping({
	        index: indexName,
	        type: docType,
	        body: payload
	    }).then(function (resp) {
	        res.status(200);
	        return res.json(resp)
	    }, function (err) {
	        res.status(500)
	        return res.json(err)
	    });
	},

	// 4.a. Add/Update a document
	addDocument: function(req, res, indexName, docType, payload){
	    elasticClient.index({
	        index: indexName,
	        type: docType,
	        body: payload
	    }).then(function (resp) {
	        res.status(200);
	        return res.json(resp)
	    }, function (err) {
	        res.status(500)
	        return res.json(err)
	    });
	},

	// 4.b. Add/Update all documents
	addAllDocuments: function(req, res, payload){
		console.log('This is the final request', payload)
	    elasticClient.bulk({
	        body: payload
	    }).then(function (resp) {
	        res.status(200);
	        return res.json(resp)
	    }, function (err) {
	        res.status(500)
	        return res.json(err)
	    })
	    .catch((err) => {
	    	console.log('Error in adding all docs', err)
	    })
	},



	// 5. Update a document
	updateDocument: function(req, res, index, docType, payload){
		elasticClient.update({
		  index: index,
		  type: docType,
		  body: payload
		}, function (err, resp) {
		  	if(err) return res.json(err);
		  	return res.json(resp);
		})
	},

	// 6. Search
	search: function(req, res, payload){
		elasticClient.search(payload)
		.then(function (resp) {
	        return res.json(resp)
	    }, function (err) {
	        return res.json(err.message)
	    });
	},


	/*
	 *	[xxxxxxxxxxxxxxxxx=-----  DANGER AREA [RESTRICTED USE] -----=xxxxxxxxxxxxxxxxxxxxx]
	 */

	 // Delete a document from an index
	deleteDocument: function(req, res, index, docType){
		elasticClient.delete({
		    index: index,
			type: docType
		}, function(err, resp) {
		    if (err) return res.json(err);
		    return res.json(resp);
		});
	},

	// Delete index
	deleteIndex: function(req, res){
		elasticClient.indices.delete({
		    index: req.index
		}, function(err, resp) {
		    if (err) {
		        console.error(err.message);
		    } else {
		        console.log('Indexes have been deleted!', resp);
		        return res.json(resp)
		    }
		});
	},

	// Delete all
	deleteAll: function(req, res){
		elasticClient.indices.delete({
		    index: '_all'
		}, function(err, resp) {

		    if (err) {
		        console.error(err.message);
		    } else {
		        console.log('Indexes have been deleted!', resp);
		        return res.json(resp)
		    }
		});
	},

	// [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx]
};