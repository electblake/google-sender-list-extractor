module.exports = function(app) {
	// app.use('/emails', require('./emails'));

	// index
	app.use('/', require('./pages'));
	require('./views')(app);

};