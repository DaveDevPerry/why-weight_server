const Group = require('../models/groupModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// mongo uses _id for id property
const createToken = (_id) => {
	// {payload} , secret, expires 3 days
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// login group
const joinGroup = async (req, res) => {
	const { title, pin, userID } = req.body;
	try {
		// login() is the static method of user
		const group = await Group.login(title, pin, userID);
		// create a token
		const token = createToken(group._id);
		console.log(group, 'user login user');
		const groupId = group._id;

		res.status(200).json({ title, token, groupId });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// signup user
const signupGroup = async (req, res) => {
	const { title, pin, userID, target_date, target_reason } = req.body;
	try {
		// signup() is the static method of user
		const group = await Group.signup(
			title,
			pin,
			userID,
			target_date,
			target_reason
		);
		// create a token
		const token = createToken(group._id);

		res.status(200).json({ title, token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// get all weights
const getGroups = async (req, res) => {
	// const user_id = req.user._id;

	// get users groups
	const usersGroups = await User.findById(req.user._id).populate({
		path: 'groups',
	});

	console.log(usersGroups, 'usersGroups getGroups');

	const userGroups = await usersGroups.groups;

	console.log(userGroups, 'user groups array');

	let groupIDs = userGroups.map(({ _id }) => _id);

	// const groupIDs = userGroups.map((_id) => _id);
	console.log(groupIDs, 'user groupIDs array');

	const records = await Group.find({ _id: { $in: groupIDs } }).populate({
		path: 'all_participants chairperson_user_id',
	});
	// const records = await Group.find({ _id: { $in: groupIDs } });

	console.log(records, 'user records array');

	// const groups = await Group.find({
	// 	all_participants: { $in: [req.user._id] },
	// })
	// 	.sort({
	// 		createdAt: -1,
	// 	})
	// 	.populate({ path: 'all_participants' })
	// 	.exec();

	// const clonedGroups = groups;
	// console.log(clonedGroups, 'cloned groups admin');

	// res.status(200).json(groups);

	res.status(200).json(records);
	// res.status(200).json(userGroups);
	// res.status(200).json(userGroups);
};
// // get all weights
// const getGroups = async (req, res) => {
// 	const chairperson_user_id = req.user._id;

// 	// only finds weights that match chairperson_user_id
// 	const groups = await Group.find({ chairperson_user_id }).sort({
// 		createdAt: -1,
// 	});
// 	// .populate({ path: 'chairperson_user_id' });
// 	res.status(200).json(groups);
// };

// get a single workout
const getGroup = async (req, res) => {
	const { id } = req.params;
	// check if id exists
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such group' });
	}
	// Claim.findOne({_id : claimId}).populate({path: 'billed_insurances'})

	// const group = await Group.findById(id).populate({
	// 	path: 'User',
	// 	populate: [{ path: 'all_participants' }, { path: 'chairperson_user_id' }],
	// });
	const group = await Group.findById(id).populate({
		path: 'all_participants participants chairperson_user_id',
	});

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
		// const chairperson_user_id = req.user._id;
		const participant_user_id = req.user._id;
		// const participant_id = req.user._id;
		const group = await Group.create({
			title,
			pin,
			chairperson_user_id: req.user._id,
			// participant_user_id,
			// $push: { participants: participant_id },
			// participants.push(participant_id),
		});
		// group.participants.push(req.user._id);
		group.all_participants.push(req.user._id);
		// group.participants.push(participant_id);
		// group.all_participants.push(participant_id);
		// group.chairperson_user_id = req.user._id;
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
	const userId = req.user._id;
	console.log(id, 'id in group controller');
	console.log(userId, 'userId in group controller');
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
			// all_participants: all_participants.push(userId),
			// all_participants: all_participants.push(userId),
		}
	);
	// group.all_participants.push(userId);
	// await group.save();
	console.log(group, 'group in update');
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
	joinGroup,
	signupGroup,
};

// // get all weights
// const getGroups = async (req, res) => {
// 	// const chairperson_user_id = req.user._id;

// 	// // only finds weights that match chairperson_user_id
// 	// const groups = await Group.find({ chairperson_user_id }).sort({
// 	// 	createdAt: -1,
// 	// });

// 	// only finds groups that participants arr includes req.user._id - WORKING
// 	// const groups = await Group.find({
// 	// 	all_participants: { $in: [req.user._id] },
// 	// }).sort({
// 	// 	createdAt: -1,
// 	// });
// 	const groups = await Group.find({
// 		all_participants: { $in: [req.user._id] },
// 	})
// 		.sort({
// 			createdAt: -1,
// 		})
// 		.populate({ path: 'all_participants' })
// 		.exec();

// 	const clonedGroups = groups;
// 	console.log(clonedGroups, 'cloned groups admin');

// 	// .populate({
// 	// 	path: 'all_participants',
// 	// });

// 	// .populate({
// 	// 	path: 'User',
// 	// 	populate: [{ path: 'all_participants' }, { path: 'chairperson_user_id' }],
// 	// });
// 	// .populate({
// 	// 	path: 'chairperson_user_id',
// 	// 	model: 'User',
// 	// 	select: '_id first_name',

// 	// const user_group_id = req.user._id;
// 	// const userGroups = await User.find({
// 	// 	group_id: user_group_id,
// 	// });

// 	// console.log(userGroups, 'user groups in group controller');

// 	// const allGroups = await Group.find({
// 	// 	participants: participants.includes(chairperson_user_id),
// 	// });
// 	// .populate({ path: 'chairperson_user_id' });
// 	// console.log(allGroups, 'all groups');
// 	res.status(200).json(groups);
// };
// // // get all weights
// // const getGroups = async (req, res) => {
// // 	const chairperson_user_id = req.user._id;

// // 	// only finds weights that match chairperson_user_id
// // 	const groups = await Group.find({ chairperson_user_id }).sort({
// // 		createdAt: -1,
// // 	});
// // 	// .populate({ path: 'chairperson_user_id' });
// // 	res.status(200).json(groups);
// // };

// // get a single workout
// const getGroup = async (req, res) => {
// 	const { id } = req.params;
// 	// check if id exists
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ error: 'No such group' });
// 	}
// 	// Claim.findOne({_id : claimId}).populate({path: 'billed_insurances'})

// 	// const group = await Group.findById(id).populate({
// 	// 	path: 'User',
// 	// 	populate: [{ path: 'all_participants' }, { path: 'chairperson_user_id' }],
// 	// });
// 	const group = await Group.findById(id).populate({
// 		path: 'all_participants participants chairperson_user_id',
// 	});

// 	if (!group) {
// 		return res.status(404).json({ error: 'No such group' });
// 	}
// 	res.status(200).json(group);
// };

// // create new workout
// const createGroup = async (req, res) => {
// 	const { title, pin } = req.body;
// 	// console.log(weight, 'weight');
// 	// const { title, title, reps } = req.body;

// 	// handles ui error message if not all fields are complete
// 	const emptyFields = [];

// 	if (!pin) {
// 		emptyFields.push('pin');
// 	}
// 	// if (!deadline_reason) {
// 	// 	emptyFields.push('deadline_reason');
// 	// }
// 	if (!title) {
// 		emptyFields.push('title');
// 	}
// 	// if (!weight) {
// 	// 	emptyFields.push('weight');
// 	// }
// 	if (emptyFields.length > 0) {
// 		return res
// 			.status(400)
// 			.json({ error: 'Please fill in all the fields', emptyFields });
// 	}

// 	// add doc to db
// 	try {
// 		// user._id comes from middleware VITAL FOR weights SPECIFIC TO A USER
// 		// const chairperson_user_id = req.user._id;
// 		const participant_user_id = req.user._id;
// 		// const participant_id = req.user._id;
// 		const group = await Group.create({
// 			title,
// 			pin,
// 			chairperson_user_id: req.user._id,
// 			// participant_user_id,
// 			// $push: { participants: participant_id },
// 			// participants.push(participant_id),
// 		});
// 		// group.participants.push(req.user._id);
// 		group.all_participants.push(req.user._id);
// 		// group.participants.push(participant_id);
// 		// group.all_participants.push(participant_id);
// 		// group.chairperson_user_id = req.user._id;
// 		await group.save();
// 		// group.participants.push(req.params.id)
// 		res.status(200).json(group);
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// };

// // participants,
// // participants: participants.push(participant),
// // participants: participant,
// // participants: [...state, participant],

// // delete a workout
// const deleteGroup = async (req, res) => {
// 	const { id } = req.params;
// 	// check if id exists
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ error: 'No such group' });
// 	}
// 	const group = await Group.findOneAndDelete({ _id: id });
// 	if (!group) {
// 		return res.status(404).json({ error: 'No such group' });
// 	}
// 	res.status(200).json(group);
// };

// // update a group
// const updateGroup = async (req, res) => {
// 	const { id } = req.params;
// 	const userId = req.user._id;
// 	console.log(id, 'id in group controller');
// 	console.log(userId, 'userId in group controller');
// 	// check if id exists
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ error: 'No such group' });
// 	}
// 	const group = await Group.findByIdAndUpdate(
// 		{ _id: id },
// 		// second object contains data to update
// 		{
// 			// gets all properties in body
// 			...req.body,
// 			// all_participants: all_participants.push(userId),
// 			// all_participants: all_participants.push(userId),
// 		}
// 	);
// 	// group.all_participants.push(userId);
// 	// await group.save();
// 	console.log(group, 'group in update');
// 	if (!group) {
// 		return res.status(404).json({ error: 'No such group' });
// 	}
// 	res.status(200).json(group);
// };
