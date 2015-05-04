var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cfg = require('./config');
var log = require('./logger');

var options = {
	host: cfg.REDIS_HOST,
	pass: cfg.REDIS_PASS
};

log.debug('redis', options);

module.exports = new RedisStore(options);