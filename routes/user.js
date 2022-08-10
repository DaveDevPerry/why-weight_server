const express = require('express');

// Controller functions
const {
	signupUser,
	loginUser,
	updateUser,
} = require('../controllers/userController');

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', signupUser);

// UPDATE a user
router.patch('/:id', updateUser);

module.exports = router;
