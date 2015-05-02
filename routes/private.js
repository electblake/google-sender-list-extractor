module.exports = function(app) {

	// google auth
	app.use('/auth/google', require('./auth/google/authorize'));
	app.use('/auth/google', require('./auth/google/callback'));
	// custom auth
	app.use('/auth', require('./auth/session'));

	var User = require('../models/User');
	app.use(function(req, res, next) {
		if (req.session.userId && !req.user) {
			User.findById(req.session.userId, function(err, user) {
				req.user = user;
				req.session.touch();
				next();
			});
		}
		next();
	});


	app.use('/api/labels', require('./labels'));

};