var router = require('express').Router();
var google = require('../../../lib/google');
var auth = google.google.oauth2('v2');

router.get('/callback', function(req, res, next) {
	var oauth2Client = google.client;

	var code = req.query.code;

	oauth2Client.getToken(code, function(err, tokens) {
	  // Now tokens contains an access_token and an optional refresh_token. Save them.
	  if(!err) {
	    oauth2Client.setCredentials(tokens);
	    req.session.google = { tokens: tokens };

	    auth.userinfo.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
	    	if (err) { console.error(err); res.status(err.code).send(err.toString()); } else {
		    	// console.log('response', response);

		    	req.session.email = response.email;
		    	req.session.name = response.name;
		    	
		    	res.redirect('/auth/google/success');
	    	}
	    });
	    
	  } else {
	  	res.status(401).send('Google client.getToken ' + err.toString());
	  }
	});
	
});

module.exports = router;