var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cfg = require('./lib/config');

var app = express();

require('./lib/views')(app);

var publicFolder = 'public';
global.publicFolder = path.join(__dirname, publicFolder);
app.use(express.static(path.join(__dirname, publicFolder)));

// set globals
global.appRoot = path.resolve(__dirname);
global.originWhitelist = ['http://localhost'];

app.use(express.query());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Servies
 */
require('./lib/mongoose')(app);
require('./lib/sessions')(app);

/**
 * Routes
 */

require('./routes/public')(app);
require('./routes/private')(app);

// app.use(function(err, req, res, next) {
// 	if (err) {
// 		console.error(err.stack);
// 		res.status(500).send('Something broke!');
// 	} else {
// 		next();
// 	}
// });

module.exports = app;
