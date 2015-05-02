#!/usr/bin/env node
var cfg = require('./lib/config');
var app = require('./app');
var log = require('./lib/logger');

app.set('port', (cfg.PORT || 5000));

var http = require('http').Server(app);

var server = http.listen(app.get('port'), function() {
	log.info('Express 4 on port', server.address().port);
});