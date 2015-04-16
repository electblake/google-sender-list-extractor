#!/usr/bin/env node
var cfg = require('./lib/config');
var app = require('./app');
app.set('port', (cfg.PORT || 5000));

var http = require('http').Server(app);

var server = http.listen(app.get('port'), function() {
	console.log('Express 4 on port', server.address().port);
});