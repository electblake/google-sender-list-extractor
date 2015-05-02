var mongoose = require('mongoose');
var UserSchema = require('./schema/UserSchema');
module.exports = mongoose.model('User', UserSchema);