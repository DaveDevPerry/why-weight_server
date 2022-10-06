const express = require('express');

// Controller functions
const {
	signupUser,
	loginUser,
	updateUser,
	getUser,
} = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', signupUser);

// Get User
router.get('/:id', getUser);

// this fires the middleware function to ensure all workout routes require authentication

router.use(requireAuth);
// UPDATE a user
router.patch('/:id', updateUser);

module.exports = router;
