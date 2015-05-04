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
	require('./users/restful')(app);
	app.use('/api/users', require('./users/bundles'));
	app.use('/api/users', require('./users/download'));

	// google api interaction
	app.use('/api/gapi', require('./gapi/labels'));
	app.use('/api/gapi', require('./gapi/capture'));
	app.use('/api/gapi', require('./gapi/bundle'));

};