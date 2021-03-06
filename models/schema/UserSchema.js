var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var LabelSchema = require('./LabelSchema');

var UserSchema = new Schema({
	email: { type: String, required: true },
	name: { type: String },
	labels: [LabelSchema],
	capture: {
		after_unit: { type: String, default: 'years' },
		after_num: { type: Number, default: 1 }
	},
	auth: {
		google: {
			tokens: {
				access_token: { type: String },
				token_type: { type: String },
				id_token: { type: String },
				expiry_date: { type: Date }
			}
		}
	},
	added: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now }
});

module.exports = UserSchema;