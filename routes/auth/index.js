// generics
var router = require('express').Router();

router.get('/auth/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/#/');
});

module.exports = router;