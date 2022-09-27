const Weight = require('../models/weightModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// get all weights
const getWeights = async (req, res) => {
	// const user_id = req.user._id;

	// get users weights
	const usersWeights = await User.findById(req.user._id).populate({
		path: 'weights',
	});

	console.log(usersWeights, 'usersWeights getWeights');

	const userWeights = await usersWeights.weights;

	console.log(userWeights, 'user weights array');

	let weightIDs = userWeights.map(({ _id }) => _id);

	console.log(weightIDs, 'user weightIDs array');

	const records = await Weight.find({ _id: { $in: weightIDs } });

	console.log(records, 'user weight records array');
	res.status(200).json(records);

	// only finds weights that match user_id
	// const weights = await Weight.find({ user_id }).sort({ createdAt: -1 });
	// res.status(200).json(weights);
};
// // get all weights
// const getWeights = async (req, res) => {
// 	const user_id = req.user._id;

// 	// only finds weights that match user_id
// 	const weights = await Weight.find({ user_id }).sort({ createdAt: -1 });
// 	res.status(200).json(weights);
// };

// get a single workout
const getWeight = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such weight' });
	}
	const weight = await Weight.findById(id);
	if (!weight) {
		return res.status(404).json({ error: 'No such weight' });
	}
	res.status(200).json(weight);
};

// create new workout
const createWeight = async (req, res) => {
	const { load } = req.body;
	// console.log(weight, 'weight');
	// const { title, load, reps } = req.body;

	// handles ui error message if not all fields are complete
	const emptyFields = [];

	// if (!title) {
	// 	emptyFields.push('title');
	// }
	if (!load) {
		emptyFields.push('load');
	}
	// if (!weight) {
	// 	emptyFields.push('weight');
	// }
	if (emptyFields.length > 0) {
		return res
			.status(400)
			.json({ error: 'Please fill in all the fields', emptyFields });
	}

	// add doc to db
	try {
		// user._id comes from middleware VITAL FOR weights SPECIFIC TO A USER
		const user_id = req.user._id;
		const weight = await Weight.create({ load, user_id });
		res.status(200).json(weight);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// delete a workout
const deleteWeight = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such weight' });
	}
	const weight = await Weight.findOneAndDelete({ _id: id });
	if (!weight) {
		return res.status(404).json({ error: 'No such weight' });
	}
	res.status(200).json(weight);
};

// update a weight
const updateWeight = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such weight' });
	}
	const weight = await Weight.findByIdAndUpdate(
		{ _id: id },
		// second object contains data to update
		{
			// gets all properties in body
			...req.body,
		}
	);
	if (!weight) {
		return res.status(404).json({ error: 'No such weight' });
	}
	res.status(200).json(weight);
};

module.exports = {
	getWeights,
	getWeight,
	createWeight,
	deleteWeight,
	updateWeight,
};
