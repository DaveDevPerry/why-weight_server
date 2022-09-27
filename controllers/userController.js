const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// mongo uses _id for id property
const createToken = (_id) => {
	// {payload} , secret, expires 3 days
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// login user
const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		// login() is the static method of user
		const user = await User.login(email, password);
		// create a token
		const token = createToken(user._id);
		console.log(user, 'user login user');
		const first_name = user.first_name;
		const last_name = user.last_name;
		// const groups =
		const userId = user._id;

		res.status(200).json({ email, token, first_name, last_name, userId });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
	// res.json({ mssg: 'login user' });
};

// signup user
const signupUser = async (req, res) => {
	const { email, password, first_name, last_name } = req.body;
	try {
		// signup() is the static method of user
		const user = await User.signup(email, password, first_name, last_name);
		// create a token
		const token = createToken(user._id);

		res.status(200).json({ email, token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// // get a single user
// const getUser = async (req, res) => {
// 	const { id } = req.params;
// 	// check if id exists
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ error: 'No such user' });
// 	}
// 	const user = await User.findById(id);
// 	if (!user) {
// 		return res.status(404).json({ error: 'No such user' });
// 	}
// 	res.status(200).json(user);
// };

// update a user
const updateUser = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such user' });
	}
	// const checkUser = await User.findById({ _id: id });
	// console.log(checkUser, 'check user in update');
	// console.log({ ...req.body }, 'req.body');
	const user = await User.findByIdAndUpdate(
		{ _id: id },
		// second object contains data to update
		{
			// gets all properties in body
			...req.body,
		}
	);
	// if (!checkUser) {
	// 	return res.status(404).json({ error: 'No such user' });
	// }
	// res.status(200).json(checkUser);
	if (!user) {
		return res.status(404).json({ error: 'No such user' });
	}
	res.status(200).json(user);
};

module.exports = { signupUser, loginUser, updateUser };
