module.exports = function(app) {
	app.use('/emails', require('./emails/start'));

	// index
	app.use('/', require('./pages'));
	require('./views')(app);

};