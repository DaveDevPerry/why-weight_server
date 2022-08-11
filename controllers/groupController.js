const Group = require('../models/groupModel');
const mongoose = require('mongoose');

// get all weights
const getGroups = async (req, res) => {
	const chairperson_user_id = req.user._id;

	// only finds weights that match chairperson_user_id
	const groups = await Group.find({ chairperson_user_id }).sort({
		createdAt: -1,
	});
	res.status(200).json(groups);
};

// get a single workout
const getGroup = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such group' });
	}
	const group = await Group.findById(id);
	if (!group) {
		return res.status(404).json({ error: 'No such group' });
	}
	res.status(200).json(group);
};

// create new workout
const createGroup = async (req, res) => {
	const { title, pin } = req.body;
	// console.log(weight, 'weight');
	// const { title, title, reps } = req.body;

	// handles ui error message if not all fields are complete
	const emptyFields = [];

	if (!pin) {
		emptyFields.push('pin');
	}
	// if (!deadline_reason) {
	// 	emptyFields.push('deadline_reason');
	// }
	if (!title) {
		emptyFields.push('title');
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
		const chairperson_user_id = req.user._id;
		const participant_user_id = req.user._id;
		const participant_id = req.user._id;
		const group = await Group.create({
			title,
			pin,
			chairperson_user_id,
			participant_user_id,
			// $push: { participants: participant_id },
			// participants.push(participant_id),
		});
		group.participants.push(participant_id);
		group.all_participants.push(participant_id);
		await group.save();
		// group.participants.push(req.params.id)
		res.status(200).json(group);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// participants,
// participants: participants.push(participant),
// participants: participant,
// participants: [...state, participant],

// delete a workout
const deleteGroup = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such group' });
	}
	const group = await Group.findOneAndDelete({ _id: id });
	if (!group) {
		return res.status(404).json({ error: 'No such group' });
	}
	res.status(200).json(group);
};

// update a group
const updateGroup = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such group' });
	}
	const group = await Group.findByIdAndUpdate(
		{ _id: id },
		// second object contains data to update
		{
			// gets all properties in body
			...req.body,
		}
	);
	if (!group) {
		return res.status(404).json({ error: 'No such group' });
	}
	res.status(200).json(group);
};

module.exports = {
	getGroups,
	getGroup,
	createGroup,
	deleteGroup,
	updateGroup,
};
