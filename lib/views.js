var readJson = require('read-package-json'),
	path = require('path'),
	exphbs = require('express-handlebars');

exports = module.exports = function(app) {
	app.set('views', path.join(__dirname, '../views'));

	var partialDirs = [
	    app.get('views') + '/partials'
	];

	app.set('view cache', false);

	// app.enable('view cache');

	// create express render engine handlebars
	var renderLib = exphbs.create({
	    defaultLayout: 'default',
	    partialsDir: partialDirs,
	    extname: '.hbs'
	});

	app.engine('.hbs', renderLib.engine);
	app.set('view engine', '.hbs');
};