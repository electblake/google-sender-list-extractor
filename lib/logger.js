var winston = require('winston');
winston.level = 'debug';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	colorize: true
});
module.exports = winston;