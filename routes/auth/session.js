var router = require('express').Router();

router.get('/session', function(req, res, next) {
	res.send(req.session);
});

module.exports = router;