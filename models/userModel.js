const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		group_id: {
			type: String,
			required: false,
		},
		groups: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Group',
				},
			],
			required: false,
		},
		weights: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Weight',
				},
			],
			required: false,
		},

		// d_o_b: {
		// 	type: Date,
		// 	required: false,
		// },
	},
	{ timestamps: true }
);

// @ note  DON'T USE ARROW FUNCTIONS IF USING "THIS" KEYWORD
// static signup method - call this method on the user model whenever we want to signup a new user
userSchema.statics.signup = async function (
	email,
	password,
	first_name,
	last_name
) {
	// validation
	if (!email || !password || !first_name || !last_name) {
		throw Error('All fields must be filled');
	}
	// uses validator to check if valid email
	if (!validator.isEmail(email)) {
		throw Error('Email not valid');
	}
	// uses validator to check if password created is strong enough
	if (!validator.isStrongPassword(password)) {
		throw Error('Password not strong enough');
	}

	// "this" - refers to User
	const exists = await this.findOne({ email });

	if (exists) {
		throw Error('Email already in use');
	}

	// save user
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({
		email,
		password: hash,
		first_name,
		last_name,
	});

	return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
	// check fields are filled
	if (!email || !password) {
		throw Error('All fields must be filled');
	}

	// "this" - refers to User
	const user = await this.findOne({ email });
	// does user exist
	if (!user) {
		throw Error('incorrect email');
	}
	// password is from body, user.password is the hashed one
	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw Error('Incorrect password');
	}

	console.log(user, 'user user model static');

	return user;
};

module.exports = mongoose.model('User', userSchema);
