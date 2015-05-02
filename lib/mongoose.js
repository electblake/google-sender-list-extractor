var mongoose = require('mongoose'),
	cfg = require('./config');
	
module.exports = exports = function(app) {
	mongoose.connect(cfg.MONGO_URI, function(err) {
    	if (err) {
    		console.log('database error state', mongoose.connection.readyState);
    	}
	});
};