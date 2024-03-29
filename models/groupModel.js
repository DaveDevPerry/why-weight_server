const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

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
		pinString: {
			type: String,
			required: true,
		},
		target_date: {
			type: Date,
			required: true,
		},
		target_reason: {
			type: String,
			required: false,
		},
		chairperson_user_id: {
			// type: {
			// type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			// required: false,
		},
		// },
		// },
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

// @ note  DON'T USE ARROW FUNCTIONS IF USING "THIS" KEYWORD
// static signup method - call this method on the user model whenever we want to signup a new user
groupSchema.statics.signup = async function (
	title,
	pin,
	userID,
	target_date,
	target_reason
) {
	console.log(userID, 'userID in signup');
	// validation
	if (!title || !pin) {
		throw Error('All fields must be filled');
	}
	// uses validator to check if valid email
	// if (!validator.isEmail(email)) {
	// 	throw Error('Email not valid');
	// }
	// uses validator to check if password created is strong enough
	if (!validator.isStrongPassword(pin)) {
		throw Error('Pin not strong enough');
	}

	// "this" - refers to Group
	const exists = await this.findOne({ title });

	if (exists) {
		throw Error('group name already in use');
	}

	// save user
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(pin, salt);

	const currentUser = await User.findById(userID);

	console.log(currentUser, 'currentUser');

	const group = await this.create({
		title,
		pin: hash,
		pinString: pin,
		target_date,
		target_reason,
		chairperson_user_id: currentUser._id,
		// chairperson_user_id: userID,
		// all_participants.push(currentUser._id),
		// all_participants: all_participants.push(currentUser._id),
	});
	// (group.chairperson_user_id = currentUser._id),
	group.all_participants.push(currentUser._id);
	await group.save();

	const user = await User.findByIdAndUpdate(
		{ _id: currentUser._id },
		{ $push: { groups: group._id } }
	);

	console.log(user, 'updated groups with group id?');

	return group;
};

// static login method
groupSchema.statics.login = async function (title, pin, userID) {
	console.log(userID, 'userID in login');
	// check fields are filled
	if (!title || !pin) {
		throw Error('All fields must be filled');
	}

	// "this" - refers to User
	const group = await this.findOne({ title });
	// does user exist
	if (!group) {
		throw Error('incorrect group name');
	}
	// password is from body, user.password is the hashed one
	const match = await bcrypt.compare(pin, group.pin);

	if (!match) {
		throw Error('Incorrect pin');
	}

	const currentUser = await User.findById(userID);

	// console.log(currentUser, 'currentUser');

	group.all_participants.push(currentUser._id);
	// console.log(group, 'group group login model static');
	await group.save();

	const user = await User.findByIdAndUpdate(
		{ _id: currentUser._id },
		{ $push: { groups: group._id } }
	);

	// console.log(user, 'updated groups with group id?');
	return group;
};

module.exports = mongoose.model('Group', groupSchema);
