var log = require('../../lib/logger');
var cfg = require('../../lib/config');

var router = require('express').Router();

var auth_session = require('../lib/auth-session');
var google = require('../../lib/google/');
var gmail = google.google.gmail('v1');

router.get('/index', auth_session, function(req, res, next) {

	var auth = google.client;
	// console.log('req.user', JSON.stringify(req.user, null, 4));
	auth.setCredentials(req.user.auth.google.tokens);

	var params = { userId: 'me', id: req.session.email, auth: auth };

	try {

		gmail.users.labels.get(params, function(err, labels) {
			if (err) {
				console.error('error', err);
				res.send('Error');
			} else {
				res.send(labels);
			}
		});

	} catch (err) {
		log.error(err);
	}

	next();
});

module.exports = router;