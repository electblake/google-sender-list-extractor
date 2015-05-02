var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cfg = require('./config');
var options = {
	host: cfg.REDIS_HOST,
	pass: cfg.REDIS_PASS
};
module.exports = new RedisStore(options);