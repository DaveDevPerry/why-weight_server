require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

require('./mailer/app.js');

const weightRoutes = require('./routes/weights');
const targetRoutes = require('./routes/targets');
// const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/groups');

// express app
app.use(cors());

// middleware
// looks for any request to see if it has a body and then parses it
app.use(express.json());
app.use((req, res, next) => {
	// logs each request
	console.log(req.path, req.method);
	next();
});

// routes
app.use('/api/weights', weightRoutes);
app.use('/api/targets', targetRoutes);
// app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.use('/api/groups', groupRoutes);

// connect to db
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
	})
	.then(() => {
		// listen for requests once connected to db
		app.listen(process.env.PORT, () => {
			console.log(`connected to db & listening on port ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});

//
