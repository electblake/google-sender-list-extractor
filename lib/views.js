var readJson = require('read-package-json'),
	path = require('path'),
	nunjucks = require('nunjucks'),
	layout = require('express-layout');

exports = module.exports = function(app) {
	app.set('views', path.join(__dirname, '../views'));

	app.set('view cache', false);

	app.use(layout());
	app.set('layouts', 'views/layouts');
	app.set('layout', 'default');

	// app.engine('.hbs', renderLib.engine);
	app.set('view engine', '.html');

	nunjucks.configure('views', {
	    autoescape: true,
	    express: app,
	    tags: {
			variableStart: '<%-',
			variableEnd: '%>',
		}
	});

	app.get('*', function(req, res, next) {
		res.locals.PageMeta = {
			title: 'Address Bundler'
		};

		next();
	});

};