const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.post('/volunteerEmail', (req, res)=>{
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'testingemailCM@gmail.com',
			pass: 'testing13.'
		}
	});
	var fname = req.body.fname;
	var lname = req.body.lname;
	var address1 = req.body.address1;
	var address2 = req.body.address2;
	var email = req.body.email;
	var county = req.body.county;
	var info = req.body.info;
	var message = 'VOLUNTEER<br><br>Form details below.<br><br><b>First Name:</b> '+ fname+'<br><b>Last Name:</b> '+ lname+'<br><b>Email:</b> '+ email +'<br><b>Address:</b> '+ address1 +'<br>' + address2 + '<br>' + county + '<br><b>Message:</b> '+ info;
	
	const mailOptions = {
		from: 'testingemailCM@gmail.com',
		to: 'mortimer907@gmail.com',
		subject: 'Volunteer Form by: ' + fname,
		html: message
	};


	transporter.sendMail(mailOptions, function(err,inf){
		if(err){
			console.log(err);
		} else {
			console.log('Email sent: ' + inf.response);
			res.sendStatus(200);
			//Would redirect to the correct place on the server; home.htm. This can
			//Be done quite easily
			//Send the receipt -> transporter.sendMail();
		}
	});
});
app.post('/helpEmail', (req, res)=>{
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'testingemailCM@gmail.com',
			pass: 'testing13.'
		}
	});
	console.log(req);
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var info = req.body.info;
	var message = 'Person Seeking Help<br><br>Form details below.<br><br><b>First Name:</b> '+ fname+'<br><b>Last Name:</b> '+ lname+'<br><b>Email:</b> '+ email + '<br><b>Message:</b> '+ info;
	
	const mailOptions = {
		from: 'testingemailCM@gmail.com',
		to: 'mortimer907@gmail.com',
		subject: 'Seeking Help Form by: ' + fname,
		html: message
	};


	transporter.sendMail(mailOptions, function(err,inf){
		if(err){
			console.log(err);
		} else {
			console.log('Email sent: ' + inf.response);
			res.sendStatus(200);
			//Would redirect to the correct place on the server; home.htm. This can
			//Be done quite easily
			//Send the receipt -> transporter.sendMail();
		}
	});
});


app.listen(80);
module.exports = app;
