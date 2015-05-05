var router = require('express').Router();
var glob = require('glob');
var _ = require('lodash');
var path = require('path');

router.get('/download/:filename', function(req, res) {

	var filepath = path.resolve('user-files', req.user._id.toString(), req.params.filename + '.json');
	res.setHeader('Content-disposition', 'attachment; filename='+req.params.filename + '.csv');
	res.setHeader('Content-type', 'application/json');

	var json = require(filepath);
	var csv_output = [];
	
	var csv_row = [];
	csv_row.push('date');
	csv_row.push('from');
	csv_row.push('subject');
	csv_output.push(csv_row.join(','));

	_.each(json, function(row) {

		var csv_row = [];
		csv_row.push(row.date);
		csv_row.push(row.from);
		csv_row.push(row.subject);

		csv_output.push(csv_row.join(','));
	});

	res.send(csv_output.join('\n'));
	
});

module.exports = router;