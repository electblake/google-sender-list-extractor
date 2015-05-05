var User = require('../../models/User');

module.exports = function(req, res, next) {
	req.session.touch();
	if (req.session.userId) {
		if (!req.user) {
			User.findById(req.session.userId, function(err, doc) {
				if (doc) {
					req.user = doc;
					res.locals.loggedInUser = req.user;
				}
				next();
			});
		} else {
			next();
		}
	} else {
		res.send(401).send('Not Authorized.');
	}
};