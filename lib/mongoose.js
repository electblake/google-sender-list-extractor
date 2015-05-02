var mongoose = require('mongoose'),
	cfg = require('./config');
var log = require('./logger');

module.exports = exports = function(app) {
	mongoose.connect(cfg.MONGO_URI, function(err) {
    	if (err) {
    		log.error(err);
    		console.log('database error state', mongoose.connection.readyState);
    	}
	});
};