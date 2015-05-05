var router = require('express').Router();

router.get('/logout', function(req, res) {
	req.session.destroy();
	res.send('done');
});

module.exports = router;