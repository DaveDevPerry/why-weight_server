require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// require('./mailer/app.js');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// email message options
const mailOptions = {
	from: `${process.env.SENDER_EMAIL}`,
	to: process.env.RECIPIENTS,
	subject: 'What are you weighting for?',
	text: 'Hello,  It is time to weigh yourself again',
};

// email transport configuration
const transporter = nodemailer.createTransport({
	service: process.env.SERVICE,
	// service: 'gmail',
	auth: {
		user: `${process.env.SENDER_EMAIL}`,
		pass: `${process.env.SENDER_PASSWORD}`,
	},
});

// transporter.sendMail(mailOptions, (error, info) => {
// 	if (error) {
// 		console.log(error);
// 	} else {
// 		console.log('Email send: ' + info.response);
// 	}
// });

// works
// cron.schedule('15-20 * * * *', () => {
// 	console.log('running every minute to 1 from 5');
// });

// send email
cron.schedule(
	'* 0 22 * * ',
	() => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Email send: ' + info.response);
			}
		});
	},
	{
		scheduled: true,
		timezone: 'Europe/London',
	}
);

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
