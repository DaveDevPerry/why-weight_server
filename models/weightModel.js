const mongoose = require('mongoose');

// @note - Schema defines the structure of the documents we save to a collection
const Schema = mongoose.Schema;

const weightSchema = new Schema(
	{
		// weight: {
		// 	type: Number,
		// 	required: true,
		// },
		load: {
			type: Number,
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
module.exports = mongoose.model('Weight', weightSchema);
