var router = require('express').Router();
var glob = require('glob');
var _ = require('lodash');
var auth_session = require('../lib/auth-session');

router.get('/bundles', auth_session, function(req, res) {
	if (req.user) {
		glob('user-files/' + req.user._id.toString() + '/*.json', function(err, files) {
			if (err) {
				log.error(err);
				res.status(400).send(err);
			} else {

				var filenames = [];
				_.each(files, function(file) {
					filenames.push(file.replace('user-files/'+req.user._id.toString()+'/', '').replace('.json', ''));
				});
				res.send(filenames);
			}
		});
	} else {
		res.status(401).send('Login Required');
	}
});

module.exports = router;