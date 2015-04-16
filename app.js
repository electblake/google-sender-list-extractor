var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    exphbs  = require('express-handlebars'),
    cfg = require('./lib/config');

var app = express();

// require('./lib/favicon')(app);
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

// database
require('./lib/mongoose')(app);

/**
 * Routes
 */

require('./routes/public')(app);


module.exports = app;
