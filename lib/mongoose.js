var mongoose = require('mongoose'),
	cfg = require('./config');
	
module.exports = exports = function(app) {
	mongoose.connect(cfg.mongoUri, function(err) {
    	if (err) {
    		console.log('database error state', mongoose.connection.readyState);
    	}
	});
};