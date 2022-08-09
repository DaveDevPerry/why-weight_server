const Target = require('../models/targetModel');
const mongoose = require('mongoose');

// get all weights
const getTargets = async (req, res) => {
	const user_id = req.user._id;

	// only finds weights that match user_id
	const targets = await Target.find({ user_id }).sort({ createdAt: -1 });
	res.status(200).json(targets);
};

// get a single workout
const getTarget = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such target' });
	}
	const target = await Target.findById(id);
	if (!target) {
		return res.status(404).json({ error: 'No such target' });
	}
	res.status(200).json(target);
};

// create new workout
const createTarget = async (req, res) => {
	const { target_weight, deadline_date } = req.body;
	// console.log(weight, 'weight');
	// const { title, target_weight, reps } = req.body;

	// handles ui error message if not all fields are complete
	const emptyFields = [];

	if (!deadline_date) {
		emptyFields.push('deadline_date');
	}
	if (!target_weight) {
		emptyFields.push('target_weight');
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
		const target = await Target.create({
			target_weight,
			deadline_date,
			user_id,
		});
		res.status(200).json(target);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// delete a workout
const deleteTarget = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such target' });
	}
	const target = await Target.findOneAndDelete({ _id: id });
	if (!target) {
		return res.status(404).json({ error: 'No such target' });
	}
	res.status(200).json(target);
};

// update a target
const updateTarget = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such target' });
	}
	const target = await Target.findByIdAndUpdate(
		{ _id: id },
		// second object contains data to update
		{
			// gets all properties in body
			...req.body,
		}
	);
	if (!target) {
		return res.status(404).json({ error: 'No such target' });
	}
	res.status(200).json(target);
};

module.exports = {
	getTargets,
	getTarget,
	createTarget,
	deleteTarget,
	updateTarget,
};
