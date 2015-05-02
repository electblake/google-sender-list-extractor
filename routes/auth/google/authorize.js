var router = require('express').Router();
var google = require('../../../lib/google');
var User = require('../../../models/User');
var expect = require('chai').expect;

router.get('/authorize', function(req, res, next) {
	res.redirect(google.getAuthUrl());
});

router.get('/success', function(req, res, next) {
	var auth = {
		google: req.session.google
	};

	var newUser = {
		email: req.session.email,
		name: req.session.name,
		auth: auth
	};

	User.findOne({ email: req.session.email }, function(err, doc) {
		if (err) {
			res.status(400).end(err);
		}
		else {
			var userDoc = null;

			if (doc) {
				userDoc = doc;
				if (req.session.google.tokens) {
					userDoc.auth.google = req.session.google;
				}
			} else {
				userDoc = new User(newUser);
			}

			if (userDoc) {
				req.user = userDoc;
				userDoc.save(function(err, result) {
					if (err) {
						res.status(400).send(err);
					} else {
						req.session.userId = userDoc._id;
						res.redirect('/#/emails/setup');
					}
				});
			}

		}
	});
});

module.exports = router;