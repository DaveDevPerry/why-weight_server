const express = require('express');
const {
	getWeights,
	getWeight,
	createWeight,
	deleteWeight,
	updateWeight,
} = require('../controllers/weightController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// this fires the middleware function to ensure all workout routes require authentication
router.use(requireAuth);

// /api/workouts/

// GET all workouts
router.get('/', getWeights);

// GET a single workout
router.get('/:id', getWeight);

// POST a new workout
router.post('/', createWeight);
// DELETE a workout
router.delete('/:id', deleteWeight);
// UPDATE a new workout
router.patch('/:id', updateWeight);

module.exports = router;
