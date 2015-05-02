var session = require('express-session');
var cfg = require('./config');
var redisStore = require('./redis-store');
var sess = {
  secret: '$2a$04$HbPN.jF57gqHYmK0Js6EXeGr8QKQWSUiMwc264H7/.FaJx/VhZnce',
  resave: false,
  saveUninitialized: false,
  cookie: {},
  store: redisStore
};

module.exports = function(app) {

	if (app.get('env') === 'production') {
	  // app.set('trust proxy', 1) // trust first proxy
	  sess.cookie.secure = true // serve secure cookies
	}

	app.use(session(sess));
}
