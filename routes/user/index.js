var router = require('express').Router();
var User = require('../../models/User');

router.get('/:user_id', function(req, res, next) {
	var user_id = req.params.user_id;
	User.findOne(user_id, function(err, doc) {
		res.send(doc);
	});
});

module.exports = router;