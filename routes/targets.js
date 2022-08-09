const express = require('express');
const {
	getTargets,
	getTarget,
	createTarget,
	deleteTarget,
	updateTarget,
} = require('../controllers/targetController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// this fires the middleware function to ensure all workout routes require authentication
router.use(requireAuth);

// /api/workouts/

// GET all workouts
router.get('/', getTargets);

// GET a single workout
router.get('/:id', getTarget);

// POST a new workout
router.post('/', createTarget);
// DELETE a workout
router.delete('/:id', deleteTarget);
// UPDATE a new workout
router.patch('/:id', updateTarget);

module.exports = router;
