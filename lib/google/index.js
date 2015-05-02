var google = require('googleapis');
var cfg = require('../config');

var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(cfg.GOOGLE_CLIENT_ID, cfg.GOOGLE_CLIENT_SECRET, cfg.GOOGLE_REDIRECT_URL);

var getAuthUrl = function() {
	// generate a url that asks permissions for Google+ and Google Calendar scopes
	var scopes = [
	  'https://www.googleapis.com/auth/plus.me',
	  'https://mail.google.com/',
	  'https://www.googleapis.com/auth/gmail.labels',
	  'https://mail.google.com/mail/feed/atom',
	  'https://www.googleapis.com/auth/userinfo.email',
	  'https://www.googleapis.com/auth/userinfo.profile',
	  'https://www.google.com/m8/feeds/'
	];

	var url = oauth2Client.generateAuthUrl({
	  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
	  scope: scopes // If you only need one scope you can pass it as string
	});

	return url;
};

var Google = function() {
	this.client = oauth2Client;
	this.getAuthUrl = getAuthUrl;
	this.google = google;
	return this;
};

Google.prototype.setCredentials = function(tokens) {
	this.tokens = tokens;
};

module.exports = new Google();