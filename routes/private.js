module.exports = function(app) {

	// populate req.user if we have it (like passportjs)
	var User = require('../models/User');
	app.use(function(req, res, next) {
		if (req.session.userId && !req.user) {
			User.findById(req.session.userId, function(err, user) {
				if (user) {
					req.user = user;
					req.session.touch();
				}
				next();
			});
		} else {
			next();
		}
	});

	// google auth
	app.use('/auth/google', require('./auth/google/authorize'));
	app.use('/auth/google', require('./auth/google/callback'));
	// login sesssion
	app.use('/auth', require('./auth/session'));

	// resources
	app.use('/api/user', require('./user'));
	app.use('/api/labels', require('./labels'));

};