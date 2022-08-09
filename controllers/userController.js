const User = require('../models/userModel');
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

		res.status(200).json({ email, token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
	// res.json({ mssg: 'login user' });
};

// signup user
const signupUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		// signup() is the static method of user
		const user = await User.signup(email, password);
		// create a token
		const token = createToken(user._id);

		res.status(200).json({ email, token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = { signupUser, loginUser };
