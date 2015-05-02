var log = require('../../lib/logger');
var cfg = require('../../lib/config');

var router = require('express').Router();
var auth_session = require('../lib/auth-session');

var gLib = require('../../lib/google');
var gmail = gLib.google.gmail('v1');

router.get('/setup', auth_session, function(req, res, next) {
	if (req.user.email) {

		var authClient = gLib.client;
		authClient.setCredentials(req.user.auth.google.tokens)
		var params = { userId: 'me', id: req.user.email, auth: authClient };

		gmail.users.labels.list(params, function(err, labels) {
			if (err) {
				log.error(err);
				res.status(400).send('Gmail User Labels Get ' + err.toString());
			} else {
				res.send(labels);
			}
		});
	} else {
		res.status(401).send('Error: Session Email not Found, Login Required.');
	}
});

module.exports = router;