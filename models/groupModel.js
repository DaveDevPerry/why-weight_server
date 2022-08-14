const mongoose = require('mongoose');
// const User = require('../models/userModel')

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
		// chairperson_user_id: {
		// 	type: String,
		// 	required: true,
		// },
		chairperson_user_id: {
			type: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		},
		participant_user_id: {
			type: String,
			required: true,
		},
		participants: {
			type: [
				{
					type: String,
					required: true,
				},
			],
		},
		all_participants: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
			],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);

// participants: [
// 	{
// 		type: String,
// 		// ref: 'User',
// 		// required: true,
// 	},
// ],
// participants: [
// 	{
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: 'User',
// 		// required: true,
// 	},
// ],
