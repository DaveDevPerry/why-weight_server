const mongoose = require('mongoose');
const User = require('../models/userModel');

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

weightSchema.post('save', async function (doc, next) {
	try {
		let data = await doc;
		console.log(data, 'doc in post weight');

		const currentUser = await User.findById(data.user_id);

		const user = await User.findByIdAndUpdate(
			{ _id: currentUser._id },
			{ $push: { weights: data._id } }
		);

		console.log(user, 'updated user with weight id?');
		// let data = await doc
		//   .model("User")
		//   .finOneAndUpdate({ _id: doc._id }, { exampleIDField: "some ID you want to pass" });
	} catch (error) {
		console.log('get -> error', error);
		next(error);
	}
});

// 'Workout' is the name of the model
module.exports = mongoose.model('Weight', weightSchema);
