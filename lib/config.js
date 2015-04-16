var config = require('12factor-dotenv');

var cfg = config({
    DEBUG: {
    	env: 'DEBUG',
    	type: 'string',
    	default: 'express:none'
    },
    PUBLIC_URL: {
    	env: 'PUBLIC_URL',
    	type: 'string',
    	require: true
    },
    mongoUri: {
    	env: 'MONGOHQ_URL',
    	type: 'string',
    	required: true
    },
    redisUri: {
    	env: 'REDISCLOUD_URL',
    	type: 'string',
    	required: true
    },
    PORT: {
        env      : 'PORT',
        type     : 'integer',
        default  : '9000',
        required : true,
    },
    NODE_ENV: {
        env: 'NODE_ENV',
        type: 'string'
    }
}, { debug: true });

module.exports = exports = cfg;