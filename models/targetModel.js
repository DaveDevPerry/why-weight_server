const mongoose = require('mongoose');

// @note - Schema defines the structure of the documents we save to a collection
const Schema = mongoose.Schema;

const targetSchema = new Schema(
	{
		// weight: {
		// 	type: Number,
		// 	required: true,
		// },
		target_weight: {
			type: Number,
			required: true,
		},
		deadline_date: {
			type: Date,
			required: true,
		},
		user_id: {
			type: String,
			required: true,
		},
		// automatically created timestamp when created or updated
	},
	{ timestamps: true }
);

// 'Workout' is the name of the model
module.exports = mongoose.model('Target', targetSchema);
