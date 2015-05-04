var router = require('express').Router();
var glob = require('glob');
var _ = require('lodash');
router.get('/bundles', function(req, res) {
	glob('user-files/' + req.user._id.toString() + '/*.json', function(err, files) {
		if (err) {
			log.error(err);
			res.status(400).send(err);
		} else {

			var filenames = [];
			_.each(files, function(file) {
				filenames.push(file.replace('user-files/'+req.user._id.toString()+'/', ''));
			});
			res.send(filenames);
		}
	});
});

module.exports = router;