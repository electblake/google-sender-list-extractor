var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LabelSchema = new Schema({
	id: String,
	use: Boolean,
	labelListVisibility: String,
	messageListVisibility: String,
	name: String,
	type: String
});

module.exports = LabelSchema;