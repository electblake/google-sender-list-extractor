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
    GOOGLE_CLIENT_ID: {
        env: 'GOOGLE_CLIENT_ID',
        type: 'string'
    },
    GOOGLE_CLIENT_SECRET: {
        env: 'GOOGLE_CLIENT_SECRET',
        type: 'string'
    },
    GOOGLE_REDIRECT_URL: {
        env: 'GOOGLE_REDIRECT_URL',
        type: 'string'
    },
    NODETIME_ACCOUNT_KEY: {
        env: 'NODETIME_ACCOUNT_KEY',
        type: 'string'
    },
    MONGO_URI: {
    	env: 'MONGO_URI',
    	type: 'string',
    	required: true
    },
    REDIS_DB: {
        env: 'REDIS_DB',
        type: 'string'
    },
    REDIS_PASS: {
        env: 'REDIS_PASS',
        type: 'string'
    },
    REDIS_HOST: {
    	env: 'REDIS_HOST',
    	type: 'string'
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
}, { debug: false });

module.exports = exports = cfg;