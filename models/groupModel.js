const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		pin: {
			type: String,
			required: true,
		},
		// users: {
		// 	type: Object
		// }
		chairperson_user_id: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);
