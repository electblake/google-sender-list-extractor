var path = require('path');
var fs = require('fs');

module.exports = function(app) {
	app.get('/views/:path/:filename.html', function(req, res, next) {

		var views = app.get('views');
		var viewPath = path.join(views, req.params.path, req.params.filename + '.html');

		if (fs.existsSync(viewPath)) {
			res.render(viewPath, {
				layout: 'viewfile'
			});
		} else {
			next();
		}
	});
}