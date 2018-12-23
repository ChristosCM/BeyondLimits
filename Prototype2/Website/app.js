const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: 'blDB'
});

//*********************************************************STATISTICS*************************************************************
function randRGB(i){
	var colours = []
	var borderColours = [];
	for(var x = 0; x<i; x++){
		var r = Math.floor((Math.random()*255)+1);
		var g = Math.floor((Math.random()*255)+1);
		var b = Math.floor((Math.random()*255)+1);
		colours.push('rgba('+ r +', ' + g + ', ' + b + ', 0.4)');
		borderColours.push('rgba('+ r +', ' + g + ', ' + b + ', 1)');
	}
	return [colours, borderColours]
}

function queryDB(con, sql, callback){
	con.connect(function(err){
		if(err) throw err;
		con.query(sql, function(error, res){
			if(error) throw error;
			callback(error, res);
		});
	});
}

//Takes in some value from an input; can program this later
//x is the field from the dropdown that they are plotting against frequency
//y defines what we will compare x to; attendees, volunteers, ...
//Would be stored on the server side; would need to be addressed in html as such.
//Add in more graphs later in development as needed. This is very easy.
function freqPlot(x,y,callback){
	//x the dropdown option refers to the table we are using.
	//use the connection to get data, get colours depending on number of people, and then plot graph
	if(x == "Events"){
		if(y == "Volunteers"){
			var sql = "SELECT events.eventName, COUNT(volunteerevents.idEvents) as numberPeople FROM events INNER JOIN volunteerevents ON events.idEvents = volunteerevents.idEvents";
			queryDB(con, sql, function(err, res){
				if(err) throw err;
				var c = randRGB(res.length);
				var colours = c[0];
				var borderColours = c[1];
				var labels = [];
				var data = [];
				var ylabel = "#Volunteers";
				for(var object in res){
					labels.push(res[object]['eventName']);
					data.push(res[object]['numberPeople']);
				}
				var graphComponents = {
					labels: labels,
					data: data,
					ylabel:ylabel,
					colours:colours,
					borderColours:borderColours
				};
				return callback(graphComponents);
				con.end();
			});
		} else if(y == "Attendance"){
			var sql = "SELECT eventName, attendance FROM events";
			queryDB(con, sql, function(err, res){
				if(err) throw err;
				var c = randRGB(res.length);
				var colours = c[0];
				var borderColours = c[1];
				var labels = [];
				var data = [];
				var ylabel = "#Volunteers";
				for(var object in res){
					labels.push(res[object]['eventName']);
					data.push(res[object]['attendance']);
				}
				var graphComponents = {
					labels: labels,
					data: data,
					ylabel:ylabel,
					colours:colours,
					borderColours:borderColours
				};
				return callback(graphComponents);
				con.end();
			});
		} else if("VolunteersSplit"){
			//Potentially add in a split feature for male/female later.
		}
		
	} else if(x == "Volunteers") {
		if(y == "MF"){
			var sql = "SELECT Sex, COUNT(Sex) as numberSex FROM volunteer GROUP BY Sex";
			queryDB(con, sql, function(err, res){
				if(err) throw err;
				var c = randRGB(res.length);
				var colours = c[0];
				var borderColours = c[1];
				var labels = [];
				var data = [];
				var ylabel = "#Volunteers";
				for(var object in res){
					labels.push(res[object]['Sex']);
					data.push(res[object]['numberSex']);
				}
				var graphComponents = {
					labels: labels,
					data: data,
					ylabel:ylabel,
					colours:colours,
					borderColours:borderColours
				};
				return callback(graphComponents);
				con.end();
			});
		}
	}
}
app.get('/plotGraph/:one/:two', (req, res) =>{
	var graphComponents = freqPlot(req.params.one, req.params.two, function(gC){
		res.status(200).send(gC);
	});
});


//*********************************************************EMAIL*************************************************************
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

//*********************************************************BLOG*************************************************************
function format(string) {
  var args = arguments;
  var pattern = new RegExp("%([1-" + arguments.length + "])", "g");
  return String(string).replace(pattern, function(match, index) {
  	if(Number.isInteger(args[index])){
  		return args[index];
  	} else {
  		return '"'+args[index]+'"';
  	}
  });
};

//Could easily set up a handler to get more specific posts
app.get('blogShow', (req,res)=>{
	var sql = "SELECT * FROM posts";
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		return res.send(result);
	});
});
app.post('/blogPost', (req,res) =>{
	var title = req.body.title;
	var content = req.body.content;
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd = '0'+dd
	} 

	if(mm<10) {
	    mm = '0'+mm
	} 

	today = mm + '/' + dd + '/' + yyyy;
	var sql = format("INSERT INTO posts (title, content, date) VALUES (%1,%2,%3)", title,content,today);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		console.log("Posted!");
	});
	return res.sendFile(__dirname + '/adminPage.html');
});
//This would be triggered by clicking on the post in a list on the admin page. Scrollable region???
app.post('/blogDelete/:postID', (req,res)=>{
	var pID = req.params.postID;
	var sql = format("DELETE FROM posts WHERE postID = %1;", pID);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		console.log("Removed!");
	});
	return res.sendFile(__dirname + '/adminPage.html');
});

//*********************************************************EVENTS*************************************************************
//Creating events:
//* Take the details from the page using req params.
//* INSERT these into the database.
//* Should automatically update with AJAX on the events page.
//Deleting events:
//* Take the id of the event to delete using req params.
//* DELETE this from the database.
//* Should automatically update with AJAX on the events page.
//Editing events:
//* Transition to page where just details of the event in question is shown.
//* Store the id in question for the event and DELETE the current details of the event from the table.
//* Values in the input boxes on the screen. These input boxes are in a form which POSTS
//to the same method as above in "Creating events".
//* Take the details from the page using req params.
//* INSERT these into the database.
//* Should automatically update with AJAX on the events page.


//*********************************************************VIEW*************************************************************
app.set('view engine', 'html');
var options = {
	extensions:['css', 'js', 'png', 'json', 'html']
};
app.use(express.static('./', options));
app.get('/', (req,res)=>{
	return res.sendFile(__dirname+'/home.htm');
});

app.listen(80);