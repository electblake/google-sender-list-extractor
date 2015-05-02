var router = require('express').Router();

router.get('/start', function(req, res) {
	res.send('email/start');
});

module.exports = router;