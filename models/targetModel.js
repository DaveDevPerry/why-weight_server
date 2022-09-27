const mongoose = require('mongoose');
const User = require('../models/userModel');

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
		deadline_reason: {
			type: String,
			required: false,
		},
		user_id: {
			type: String,
			required: true,
		},
		// automatically created timestamp when created or updated
	},
	{ timestamps: true }
);

targetSchema.post('save', async function (doc, next) {
	try {
		let data = await doc;
		console.log(data, 'doc in post target');

		const currentUser = await User.findById(data.user_id);

		const user = await User.findByIdAndUpdate(
			{ _id: currentUser._id },
			{ $push: { targets: data._id } }
		);

		console.log(user, 'updated user with target id?');
		// let data = await doc
		//   .model("User")
		//   .finOneAndUpdate({ _id: doc._id }, { exampleIDField: "some ID you want to pass" });
	} catch (error) {
		console.log('get -> error', error);
		next(error);
	}
});

// 'Workout' is the name of the model
module.exports = mongoose.model('Target', targetSchema);
