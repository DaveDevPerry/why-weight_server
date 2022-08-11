const express = require('express');
const {
	getGroups,
	getGroup,
	createGroup,
	deleteGroup,
	updateGroup,
} = require('../controllers/groupController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// this fires the middleware function to ensure all workout routes require authentication
router.use(requireAuth);

// /api/workouts/

// GET all workouts
router.get('/', getGroups);

// GET a single workout
router.get('/:id', getGroup);

// POST a new workout
router.post('/', createGroup);
// DELETE a workout
router.delete('/:id', deleteGroup);
// UPDATE a new workout
router.patch('/:id', updateGroup);

module.exports = router;
