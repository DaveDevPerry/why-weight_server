// require('dotenv').config();
// const nodemailer = require('nodemailer');
// // const cron = require('node-cron');

// // email message options
// const mailOptions = {
// 	from: `${process.env.SENDER_EMAIL}`,
// 	to: 'hippydipster@gmail.com',
// 	// to: 'hippydipster@gmail.com, brendaperry@hotmail.co.uk',
// 	subject: 'What are you weighting for?',
// 	text: 'Hello,  It is time to weigh yourself again',
// };

// // email transport configuration
// const transporter = nodemailer.createTransport({
// 	service: process.env.SERVICE,
// 	// service: 'gmail',
// 	auth: {
// 		user: `${process.env.SENDER_EMAIL}`,
// 		pass: `${process.env.SENDER_PASSWORD}`,
// 	},
// });

// transporter.sendMail(mailOptions, (error, info) => {
// 	if (error) {
// 		console.log(error);
// 	} else {
// 		console.log('Email send: ' + info.response);
// 	}
// });

// // works
// // cron.schedule('15-20 * * * *', () => {
// // 	console.log('running every minute to 1 from 5');
// // });

// // send email
// // cron.schedule('* * * * * ', () => {
// // 	transporter.sendMail(mailOptions, (error, info) => {
// // 		if (error) {
// // 			console.log(error);
// // 		} else {
// // 			console.log('Email send: ' + info.response);
// // 		}
// // 	});
// // })
