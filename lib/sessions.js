var session = require('express-session');
var cfg = require('./config');
// var redisStore = require('./redis-store');
var MemoryStore = session.MemoryStore;
//
var sessionStore = new MemoryStore();
var sess = {
  secret: '$2a$04$HbPN.jF57gqHYmK0Js6EXeGr8QKQWSUiMwc264H7/.FaJx/VhZnce',
  resave: false,
  saveUninitialized: true,
  cookie: {},
  store: sessionStore
};

module.exports = function(app) {

	if (app.get('env') === 'production') {
	  // app.set('trust proxy', 1) // trust first proxy
	  sess.cookie.secure = true // serve secure cookies
	}

	app.use(session(sess));
}
