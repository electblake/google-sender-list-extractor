var router = require('express').Router();
var glob = require('glob');
var _ = require('lodash');
var path = require('path');
var auth_session = require('../lib/auth-session');

router.get('/download/:filename', auth_session, function(req, res) {

	var filepath = path.resolve('user-files', req.user._id.toString(), req.params.filename + '.json');
	res.setHeader('Content-disposition', 'attachment; filename='+req.params.filename + '.csv');
	res.setHeader('Content-type', 'application/json');

	var json = require(filepath);
	var csv_output = [];
	
	var csv_row = [];
	csv_row.push('date');
	csv_row.push('name');
	csv_row.push('email');
	csv_row.push('subject');
	csv_output.push(csv_row.join(','));

	_.each(json, function(row) {

		var csv_row = [];
		csv_row.push(row.date);
		csv_row.push(row.name);
		csv_row.push(row.email);
		csv_row.push(row.subject);

		csv_output.push(csv_row.join(','));
	});

	res.send(csv_output.join('\n'));
	
});

module.exports = router;