const express = require('express');
const {
	getGroups,
	getGroup,
	createGroup,
	deleteGroup,
	updateGroup,
	joinGroup,
	signupGroup,
} = require('../controllers/groupController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Login route
router.post('/login', joinGroup);

// Signup route
router.post('/signup', signupGroup);

// this fires the middleware function to ensure all workout routes require authentication
router.use(requireAuth);

// /api/workouts/
// // Signup route
// router.post('/signup', signupGroup);

// GET all workouts
router.get('/', getGroups);

// // Login route
// router.post('/login', joinGroup);

// // Signup route
// router.post('/signup', signupGroup);
// // Login route
// router.post('/joinGroup', joinGroup);

// // Signup route
// router.post('/signupGroup', signupGroup);

// GET a single workout
router.get('/:id', getGroup);

// POST a new workout
router.post('/', createGroup);
// DELETE a workout
router.delete('/:id', deleteGroup);
// UPDATE a new workout
router.patch('/:id', updateGroup);

module.exports = router;
