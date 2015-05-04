var router = require('express').Router();
var User = require('../../models/User');
var UserSchema = require('../../models/schema/UserSchema');
var restful = require('node-restful');

module.exports = function(app) {
	var User = app.user = restful.model('user', UserSchema)
	  .methods(['get', 'post', 'put', 'delete']);

	User.register(app, '/api/users');
};