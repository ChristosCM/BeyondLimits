//Need to go back over these methods to ensure that they can only be called by DOM elements or people
//with adequate level of clearance to do so.
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const mysql = require('mysql');
const squel = require("squel");
const fs = require('fs');
const multer = require('multer');
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const crypto = require('crypto');


//*********************************************************SETUP*************************************************************
//Sets up the connection to the database with the provided parameters.
function setupConnection(host, user, password, database){
	var con = mysql.createPool({
		connectionLimit:10,
		host: host,
		user: user,
		password: password,
		database: database
	});
	return con;
}


function queryDB(con, sql, callback){
	con.getConnection(function(err,connection){
		if(err) throw err;
		connection.query(sql, function(error, res){
			connection.release();
			if(error) throw error;
			callback(error, res, connection);
		});
	});
}

//Formats strings; subs in the parameters
function format(string) {
  var args = arguments;
  var pattern = new RegExp("%([1-" + arguments.length + "])", "g");
  console.log(pattern);
  return String(string).replace(pattern, function(match, index) {
  	if(Number.isInteger(args[index])){
  		return args[index];
  	} else {
  		return '"'+args[index]+'"';
  	}
  });
};

var sha512 = function(password){
    var hash = crypto.createHmac('sha512', "dhjs277w7dt3gds6"); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};

function saltHashPassword(userpassword) {
    // var salt = genRandomString(16); * Gives us salt of length 16
    var passwordData = sha512(userpassword);
    return passwordData;
}
//Session setup
var idleTimeoutSeconds = 1800; //30 min inactivity timeout
app.use(session({
  secret: 'secretcodeofsomesort',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: idleTimeoutSeconds * 1000
  },
  rolling: true
}));
//*********************************************************AUTHORISATION/AUTHENTICATION*************************************************************
//To be called by any function requiring authentication
function auth(req, res, next) {
  if (req.session.admin)
    return next();
  else
    return res.redirect('/login');
};

app.get('/login', function (req,res){
	return res.sendFile(__dirname+'/login.htm');
});

app.post('/login', function (req, res) {
  console.log(req.body);

  var passHash = saltHashPassword(req.body.password);
  var username = req.body.username;
  var con = setupConnection("localhost", "root", "password", "blDB");
  var sql = "SELECT * FROM accounts WHERE username='" + username + "';";
  queryDB(con, sql, function(err, res){
    if(err) throw err;
    if(res.password == passHash) {
      req.session.user = username;
      req.session.admin = true;
      res.redirect('/adminPage.html');
    }
    else{
      res.sendStatus(403);
    }
    con.end();
  });
});
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("Logout successful");
});
//Function to get current session username for the "Logged in as $ADMIN$" text
app.get('/user', function(req,res){
	res.send(req.session.username);
});
app.get('/adminPage', function (req,res){
  auth(req,res,function(){
    return res.sendFile(__dirname+'/adminPage.html');
  });
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

//Takes in some value from an input; can program this later
//x is the field from the dropdown that they are plotting against frequency
//y defines what we will compare x to; attendees, volunteers, ...
//Would be stored on the server side; would need to be addressed in html as such.
//Add in more graphs later in development as needed. This is very easy.
function freqPlot(x,y,callback){
	//x the dropdown option refers to the table we are using.
	//use the connection to get data, get colours depending on number of people, and then plot graph
	var con = setupConnection("localhost", "root", "password", "blDB");
	if(x == "Events"){
		if(y == "Volunteers"){
			//var sql = "SELECT events.eventName, COUNT(volunteerevents.idEvents) as numberPeople FROM events INNER JOIN volunteerevents ON events.idEvents = volunteerevents.idEvents";
			var sql = "SELECT eventName, volunteerTotal as numberPeople FROM bldb.events;";
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
	} else if (x == "Months") {
		if (y == "People Helped") {
			var sql = "SELECT date, attendance FROM events;"
			queryDB(con, sql, function(err, res){
				if(err) throw err;
				var c = randRGB(res.length);
				var colours = c[0]
				var borderColours = c[1];
				var labels = [];
				var data = [];
				var ylabel = "#People Helped"
				var xlabel = "Months"
				for (var object in res){
					labels.push(monthNames[parseInt(res[object]['date'].split('/')[1])-1]);
					data.push(res[object]['attendance']);
				}
				var labelsEncountered = [];
				var dataEncountered = [];
				for (var object in labels){
					if (labelsEncountered.includes(labels[object])) {
						dataEncountered[labelsEncountered.indexOf(labels[object])] += data[object];
					} else {
						labelsEncountered.push(labels[object]);
						dataEncountered.push(data[object]);
					}
				}
				var graphComponents = {
					labels: labelsEncountered,
					data: dataEncountered,
					ylabel:ylabel,
					xlabel:xlabel,
					colours:colours,
					borderColours:borderColours
				};
				return callback(graphComponents);
				con.end();
			});
		} else if (y == "Volunteers"){
			var sql = "SELECT date, volunteerTotal FROM events;"
			queryDB(con, sql, function(err, res){
				if(err) throw err;
				var c = randRGB(res.length);
				var colours = c[0]
				var borderColours = c[1];
				var labels = [];
				var data = [];
				var ylabel = "#Volunteers"
				var xlabel = "Months"
				for (var object in res){
					labels.push(monthNames[parseInt(res[object]['date'].split('/')[1])-1]);
					data.push(res[object]['volunteerTotal']);
				}
				var labelsEncountered = [];
				var dataEncountered = [];
				for (var object in labels){
					if (labelsEncountered.includes(labels[object])) {
						dataEncountered[labelsEncountered.indexOf(labels[object])] += data[object];
					} else {
						labelsEncountered.push(labels[object]);
						dataEncountered.push(data[object]);
					}
				}
				var graphComponents = {
					labels: labelsEncountered,
					data: dataEncountered,
					ylabel:ylabel,
					xlabel:xlabel,
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
//lookup alternative memory stores for production: MemoryStore() causes memory leak
app.use(session({secret:"shhhhhhhhhhhh", resave:false, saveUninitialized:false, cookie: { secure: false }, user:{login:false, username: -1}}));
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
//Could easily set up a handler to get more specific posts
app.get('/blogShow', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var sql = "SELECT * FROM posts";
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		con.end();
		return res.status(200).send(result);
	});
});
//This is the version for the editing blog post.
app.post('/blogPost/:id', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");

	var bID = req.params.id;
	var title = req.body.title;
	var content = req.body.content;
	console.log(bID,title,content);
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

	today = dd + '/' + mm + '/' + yyyy;
	var sql = format("DELETE FROM posts WHERE idPosts = %1;", bID);
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		con.end();
		var con1 = setupConnection("localhost", "root", "password", "blDB");
		var sql = format("INSERT INTO posts (idposts,title,content,date) VALUES (%1,%2,%3,%4)", bID, title, content, today);
		queryDB(con1,sql,function(err1,result1){
			if(err1) throw err1;
			con1.end();
		});
		//Using this on the client side could create JS to iterate over all posts.

		return res.status(200).sendFile(__dirname + '/adminPage.html');
	});
});
app.post('/blogPost', (req,res) =>{
	var con = setupConnection("localhost", "root", "password", "blDB");
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

	today = dd + '/' + mm + '/' + yyyy;
	var sql = format("INSERT INTO posts (title, content, date) VALUES (%1,%2,%3)", title,content,today);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		con.end();
	});
	return res.status(200).sendFile(__dirname + '/adminPage.html');
});
//This would be triggered by clicking on the post in a list on the admin page. Scrollable region???
app.post('/blogDelete/:postID', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var pID = req.params.postID;
	var sql = format("DELETE FROM posts WHERE idposts = %1;", pID);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		con.end();
	});
	return res.status(200).sendFile(__dirname + '/adminPage.html');
});

//*********************************************************TESTIMONIALS*************************************************************
app.get('/testimonialsShow', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var sql = "SELECT * FROM testimonials";
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		con.end();
		return res.status(200).send(result);
	});
});
var testStorage = multer.diskStorage({
	destination: function(req, file, callback) {
			callback(null, "./images/blog");
	},
	filename: function(req, file, callback) {
					callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});
var testUpload = multer({
	storage: testStorage
}).single("testImage");
//This is the version for editing the testimonials.
app.post('/testimonialsPost/:id', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	//Implement picture upload. I have a copy of this on my PP coursework.
	eventUpload(req,res, function(err){
		//also need to unlink the previous testimonila photo from the folder
	var picPath = req.file.path;
	var tID = req.params.id;
	var name = req.body.name;
	var content = req.body.content;
	var sql = format("DELETE FROM testimonials WHERE idtestimonials = %1;", tID);
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		con.end();
		var con1 = setupConnection("localhost", "root", "password", "blDB");
		var sql = format("INSERT INTO testimonials (idtestimonials,name,content,photo) VALUES (%1,%2,%3,%4)", tID, name, content, picPath);
		queryDB(con1,sql,function(err1,result1){
			if(err1) throw err1;
			con1.end();
		});
		//Using this on the client side could create JS to iterate over all posts.

		return res.status(200).sendFile(__dirname + '/adminPage.html')
	});
});
});
app.post('/testimonialsPost', (req,res) =>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	//Implement picture upload. I have a copy of this on my PP coursework.
	eventUpload(req,res, function(err){
		var picPath = req.file.path;
	var name = req.body.name;
	var content = req.body.content;
	var sql = format("INSERT INTO testimonials (name,content,photo) VALUES (%1,%2,%3)", name, content, picPath);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		con.end();
	});
	return res.status(200).sendFile(__dirname + '/adminPage.html');
});
});
//This would be triggered by clicking on the post in a list on the admin page. Scrollable region???
app.post('/testimonialsDelete/:id', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var tID = req.params.id;
	var sql = format("DELETE FROM testimonials WHERE idtestimonials = %1;", tID);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		con.end();
	});
	return res.status(200).sendFile(__dirname + '/adminPage.html');
});

/*app.post('/fileUpload', (req,res) => {
	if(req.files){
		var file = req.files.filename;
		if(String(file.mimetypes).includes("image")){
			var fileName = file.name;
			file.mv("./img/" + fileName, function(err){
				if(err){
					console.log(err);
					return res.sendStatus(404);
				} else {

					fs.readFile('pmdbUsers.json', function(err, data){
						var json = JSON.parse(data);
						for(u in json){
							if(json[u]['username']==req.session['user']['username']){
								var userID = json[u]['id'];
							}
						}
						if(json[userID-1]['ppicture'] != "ppexample.png"){
							fs.unlink(json[userID-1]['ppicture'],function(err){
								if(err){
									console.log(err);
								}
							});
						}
						json[userID-1]['ppicture'] = "/img/"+fileName;
						fs.writeFile('pmdbUsers.json', JSON.stringify(json), function(err){if(err) console.log(err);});
					});
					return res.redirect('/adminPage.htm');
				}
			});
		} else {
			return res.redirect(403,'/adminPage.htm');
		}

	}
});*/

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

//This will get all of the events from the DB with an eventName matching. More specific handlers later on.
app.get('/eventsAll/:name', (req, res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var eventName = req.params.name;
	var sql = format("SELECT * FROM events WHERE eventName = %1",eventName);
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		con.end();
		return res.send(result);
	});
});

//This will get all of the events from the DB.
app.get('/eventsAll', (req, res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var sql = "SELECT * FROM events";
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		con.end();
		return res.send(result);
	});
});

function fileUpload(con,file,id,editStatus){
	if(String(file.mimetypes).includes("image")){
		var fileName = file.name;
		file.mv("./images/events" + fileName, function(err){
			if(err){
				console.log(err);
				return res.sendStatus(404);
			} else if(editStatus==1){
				var sql = format("SELECT pPath FROM events WHERE idEvents = %1", id)
				queryDB(con,sql,function(err1,result){
					if(err1) throw err1;
					fs.unlink("./images/events/"+result.pPath,function(err2){
						if(err2) throw err2;
					});
					var sql1 = format("UPDATE events SET pPath = %1 WHERE idEvents = %2", "./images/events/"+fileName, id)
					queryDB(con,sql1,function(err3,result1){
						if(err3) throw err3;
						return
					});
				});
			}
		});
	} else {
		return res.redirect(403,'/adminPage.htm');
	}
}
//This is the code for uploading pictures for the events
var eventStorage = multer.diskStorage({
	destination: function(req, file, callback) {
			callback(null, "./images/events");
	},
	filename: function(req, file, callback) {
					callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});
var eventUpload = multer({
	storage: eventStorage
}).single("eventImage");

//This is the version for the editing events.
app.post('/createEvent/:id', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	eventUpload(req,res, function(err){
		var pPath = req.file.path;
		//here also need to delete previous file, pull the event from the database and fs.unlink that file.
	var eID = req.params.id;
	var eventName = req.body.name;
	var attendance = req.body.attendance;
	var volunteerTotal = req.body.vTotal;
	var volunteerMale = req.body.vMale;
	var volunteerFemale = req.body.vFemale;
	var date = req.body.date;s
	var description = req.body.description;
	//This should work but needs further testing.
	var sql = format("UPDATE events SET eventName = %1, attendance = %2, volunteerTotal = %3, volunteerMale = %4, volunteerFemale = %5, pPath = %6', description = %7, date = %8 WHERE idEvents = %9;", eventName, attendance, volunteerTotal, volunteerMale, volunteerFemale,pPath, description, date, eID);
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		con.end();
		//Using this on the client side could create JS to iterate over all posts.

		return res.sendStatus(200);
	});
});
});

//This is the version for creating events.
app.post('/createEvent', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	eventUpload(req,res, function(err){
		var pPath = req.file.path;
		console.log(pPath);
	var eventName = req.body.name;
	var attendance = req.body.attendance;
	var volunteerTotal = req.body.vTotal;
	var volunteerMale = req.body.vMale;
	var volunteerFemale = req.body.vFemale;
	var date = req.body.date;
	//added this if in case there is no upload
	var pPath;
	var description = req.body.description;
	var sql = format("INSERT INTO events (idEvents,eventName,attendance,volunteerTotal,volunteerMale,volunteerFemale,pPath,description,date) VALUES (null,%1,%2,%3,%4,%5,%6,%7,%8)",eventName, attendance, volunteerTotal, volunteerMale, volunteerFemale,pPath, description,date);
	console.log(sql);
	//add this: pPath.name, in sql before description
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		con.end()
		return res.sendStatus(200);
	})
	});
});

app.post('/deleteEvent/:id', (req, res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var eID = req.params.id;
	//Delete the event by ID
	var sql = format("SELECT * FROM events WHERE idEvents = %1", parseInt(eID));
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		var eventName = result.eventName;
		var attendance = result.attendance;
		var volunteerTotal = result.volunteerTotal;
		var volunteerMale = result.volunteerMale;
		var volunteerFemale = result.volunteerFemale;
		var pPath = result.pPath;
		var description = result.description;
		var date = result.date
		var sql1 = format("INSERT INTO eventsArchive (eventName,attendance,volunteerTotal,volunteerMale,volunteerFemale,pPath,description,date) VALUES (%1,%2,%3,%4,%5,%6,%7,%8)", eventName, attendance, volunteerTotal, volunteerMale, volunteerFemale, pPath,description);
		queryDB(con, sql1, function(err1, result1){
			if(err1) throw err1;
			var sql2 = format("DELETE FROM events WHERE idEvents = %1", parseInt(eID));
			queryDB(con, sql2, function(err2,result2){
				if(err2) throw err2;
				con.end();
				return res.sendStatus(200);
			});
		});
	});
});

//*********************************************************DATABASE*************************************************************
//Receive the type of query, columns to send back, and conditions.
//gets and returns all columns for all tables
//1st element is the list of tables in order
//2nd element is the list of columns in the respective tables.
app.get('/colSQL', (req, res)=>{
	var cols = []
	function addToCols(x){
		cols.push(x);
	}
	function viewCols(){
		return cols;
	}
	var con = setupConnection("localhost", "root", "password", "blDB");
	var tableSQL = "SHOW TABLES;"
	queryDB(con, tableSQL, function(err,result,connection){
		if(err) throw err;
		var tables = []
		for(var object in result){
			tables.push(result[object]['Tables_in_bldb']);
		}
		var i = 1;
		for(var object in tables){
			var colSQL = "SHOW COLUMNS FROM " + tables[object];
			//queryDB(con, colSQL, function(err1,result1){
			connection.query(colSQL, function(err1,rows,fields){
				if(err1) throw err1;
				var columns = [];
				for(var object1 in rows){
					columns.push(rows[object1]['Field']);
				}
				addToCols(columns);
				if(i == tables.length){
					var finalCols = viewCols();
					var result = {};
					tables.forEach((table, i) => result[table] = finalCols[i]);
					return res.status(200).send(result);
				}
				i+=1;
			});
		}
		con.end()
	});
});
//Called from a form and would take the following data:
//* Type of query; INSERT, SELECT, UPDATE, DELETE,... (Use the form name: qType)
//* Depending on the type of query this would require different values:
//	-INSERT would require values for all rows from corresponding table
//	-SELECT would require the table on which to query, and the query parameter
//		...

//Instructions:
//* For the SELECT query, the form should submit to a separate JS script which formats
//the data correctly. The type of query(in this case "SELECT") should be placed into
//headers.qtype in the request, the table should be placed into the headers.qTable in the
//request. The conditions and operators need to be separated. If only one condition
//then the headers.operator list will be empty, and conditions are stored in headers.conditions.
//If more than one condition then store the operators in the list in order.
//* The DELETE query is very similar in setup to the SELECT query and should be supplied
//with the data in the same way.
//* For the INSERT query, the form should submit to a separate JS script which formats the
//data correctly. Type("INSERT") should be placed into headers.qType in the request, and
//the table should be placed into headers.qTable in the request. The fields and what to set their
//values to in the record should be stored in a list of lists in headers.conditions in the
//request. "headers.conditions[0]" will contain the fields and "headers.conditions[1]" the corresponding
//values.
//The UPDATE query is very similar in setup to the INSERT query and should be supplied with
//the data in the same way.
app.all('/query', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	//***QUERYBUILDERS***
	//Conditions may be a JSON object which is passed to the function from the switch.
	function selectQ(conditions){
		//Table to perform the query on
		var table = req.body.qtable;
		var operators = req.body.operators;
		var s = squel.select();
		s.from(table);
		//s.field(...)
		//This for loop will give away the desired structurefor conditions.
		var whereStream = ""
		var i = 0;
		for(var cond in conditions){
			//Supply conditions in one list. Make sure the conditions are safe, legal statements on client-side.
			//If more than one condition then second list "operators" will not be empty.
			//This list will specify AND or OR between conditions.
			if(conditions.length>1 && i > 0){
				whereStream += " " + operators + " ";
			}
			whereStream += conditions[cond];
			i+=1;
		}
		s.where(whereStream);
		return s.toString();
	}
	function insertQ(fields, values){
		var table = req.body.qtable;
		var s = squel.insert();
		s.into(table);
		for(var i = 0; i<values.length; i++){
			s.set(fields[i], values[i]);
		}
		return s.toString();
	}

	function deleteQ(conditions){
		var table = req.body.qtable;
		var operators = req.body.operators;
		var s = squel.delete();
		s.from(table);
		//This for loop will give away the desired structure for conditions.
		var whereStream = ""
		var i = 0;
		for(var cond in conditions){
			//Supply conditions in one list. Make sure the conditions are safe, legal statements on client-side.
			//If more than one condition then second list "operators" will not be empty.
			//This list will specify AND or OR between conditions.
			if(conditions.length>1 && i > 0){
				whereStream += " " + operators + " ";
			}
			whereStream += conditions[cond];
			i+=1;
		}
		s.where(whereStream);
		return s.toString();
	}
	function updateQ(fields, values, whereStream){
		var table = req.body.qtable;
		var s = squel.update();
		s.table(table);
		for(var i = 0; i<values.length; i++){
			s.set(fields[i], values[i]);
		}
		s.where(whereStream);
		return s.toString();
	}


	//Type of query is passed
	var type = req.body.qtype;
	//Switch based on type
	switch(type){
		case "SELECT":
			//Get all the conditions together on the client side. The format required
			//is given above in the selectQ function.
			var conditions = req.body.conditions;
			var query = selectQ(conditions);
			queryDB(con, query, function(err,result){
				return res.status(200).send(result);
				con.end();
			});
			break;
		case "INSERT":
			//req.body.conditions is a list of lists
			var fields = req.body.conditions[0];
			var values = req.body.conditions[1];
			var query = insertQ(fields, values);
			queryDB(con, query, function(err,result){
				return res.sendStatus(200);
				con.end();
			});
			break;
		case "UPDATE":
			//req.body.conditions is a list of lists
			var fields = req.body.conditions[0];
			var values = req.body.conditions[1];
			var withStream = req.body.conditions[2];
			var query = updateQ(fields, values, withStream);
			queryDB(con, query, function(err,result){
				return res.sendStatus(200);
				con.end();
			});
			break;
		case "DELETE":
			var conditions = req.body.conditions;
			var query = deleteQ(conditions);
			queryDB(con, query, function(err,result){
				return res.sendStatus(200);
				con.end();
			});
			break;
	}
});

//*********************************************************ACCOUNTS*************************************************************
app.post('/changePass', (req,res)=>{
	if(typeof req.session.user !== "undefined"){
		var con = setupConnection("localhost", "root", "password", "blDB");
		var op = req.headers.op;
		var np = req.headers.np;
		//if the hash of the old password is not equal to the hash stored then return a 403. Need to be able to select account also.
		var sql = "SELECT password FROM accounts WHERE idAccount = 1;"
		queryDB(con,sql,function(err,data){
			if(err) throw err;
			if(password != saltHashPassword(op)){
				return res.sendStatus(403);
			} else {
				var sql1 = format("UPDATE accounts SET password = %1 WHERE idAccount=1;", saltHashPassword(np));
				queryDB(con,sql,function(err1,data1){
					if(err1) throw err1;
					return res.sendStatus(200);
				});
			}
		});
	} else {
		return res.sendStatus(403);
	}
});

app.get('/randomNonce', (req,res)=>{
	var userSalt = 'dhjs277w7dt3gds6'
	function uniGenerator() {
		var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    return (S4()+S4()+S4()+S4());
	}
	var nonce = uniGenerator();
	var nonceSalt = nonce+userSalt;
	res.status(200).send(nonceSalt);
});

//*********************************************************HOMEPAGE*************************************************************
//CAROUSEL:View,add,delete content
//View() - return JSON of content in the carousel,
//array of objects form{file,color,title,subtitle}
app.get('/home/carousel', (req,res)=>{
  fs.readFile('./images/home/info.json', function(err, data){
    object = JSON.parse(data);
    res.json(object);
    if (err) throw err;
  });
});

//Add content to carousel, multipart form comes in with
//parameter index and the file to be uploaded.
//NEEDS authorisation
app.post('/admin/addHomeCarousel', function(req,res){
  var index = req.body.index;
  var validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".mp4"];
  if (validFileExtensions.includes(path.extname(req.file))){
    // Firstly rename all files of index i and above to maintain order
    fs.readdirSync('./images/home', function(err,files){
      for (i = files.length()-1; i <= index; i--){
        var curFile = files[i];
        fs.renameSync(curFile,i+1 + '.' + path.extname(curFile));
      };
      //set file upload name and path
      var storage = multer.diskStorage({
        destination: 'images/home/',
        filename: function (req, file, cb) {
          cb(null, index + path.extname(file.originalname));
        }
      });
      var upload = multer({ storage: storage });
      next();
    });
  }
  else{
    res.status(400).send('This file type is not supported, try ".jpg", ".jpeg", ".bmp", ".gif", ".png", ".mp4"'); //filetype not supported
  }
}, function(req,res){
  //new file is added to folder with index.fileExtension filename
  upload.single('newFile', function(){
    //REWRITE INFO.JSON
    var newInfo = [];
    var newFilename = index + path.extname(file.originalname);
    var newColor = req.body.color;
    var newTitle = req.body.title;
    var newSubtitle = req.body.subtitle;
    var newFile ={
      file: newFilename,
      color: newColor,
      title: newTitle,
      subtitle: newSubtitle
    }
    newInfo.append(newFile);
    fs.readFile('./images/home/info.json', function(err, data){
      if (err) throw err;
      info = JSON.parse(data);
      info.splice(index);
      for (i=0; i<=info.length; i++){
        if (i<index){//filename will be the same
          var file = info[i];
          newInfo.append(file);
        }
        else{
          var updatedFilename = i + info[i].file.slice(0)
          var file ={
            file: updatedFilename,
            color: info[i].color,
            title: info[i].title,
            subtitle: info[i].subtitle
          }
          newInfo.append(file);
          next();
        }
      }
    },function(){
      var newInfoJSON = JSON.stringify(newInfo);
      fs.writeFile("/images/home/info.json", newInfoJSON, function(err) {
        if (err) throw err;
      });
    });
  });
  res.sendStatus(200);
});

//Delete(index) - delete content at index
//NEEDS authorisation
app.post('/admin/deleteHomeCarousel', function(req,res){
  var index = req.headers.index;
  fs.readdirSync('./images/home', function(err, files){
    //files contains NumberOfPics + info.json
    if (index>=files.length || index<0){
      res.status(400).send("No file at index: " + index);
    }
    else{
      fs.unlink(files[i], function(){
        //Rename all files of index i and above to maintain order.
        for (i = index; i < files.length(); i++){
          var curFile = files[i];
          fs.renameSync(curFile,i-1 + '.' + path.extname(curFile));
        };
        //Update info.json THIS IS NOT FINISHED
        var info = [];
        fs.readdirSync('./images/home', function(err, files){
          for (i=0; i < files.length(); i++){
            var curFile = files[i];
            info.append(curFile);
          };
          then();
        },function(err){
          if (err) throw err;
          fs.writeFile(info.json, JSON.stringify(info));
          res.sendStatus(200);
        });
      });
    }
  })
});

//*********************************************************ABOUT US*************************************************************
//Get text, could be html which would incorporate images, though editing could be an issue unless WYSIWYG editor is used in admin page.
app.get('/aboutUsText', (req,res)=>{
	fs.readFile('./textContent/aboutUsText.txt', 'utf8', function(err, data) {
    if (err) throw err;
		res.json(data);
  });
});
//Admin
//Post request to update text
//NEEDS authorisation
app.post('/aboutUsText', (req,res)=>{
	var content = fs.writeFile('./textContent/aboutUsText.txt', req.body.mainText, function(err, data) {
  	if (err) throw err;
    res.sendStatus(200);
  });
});
//*********************************************************HOW WE CAN HELP*************************************************************
//Get What we can do for you tab text
app.get('/howWeCanHelpText', (req,res)=>{
	fs.readFile('./textContent/howWeCanHelpText.txt', 'utf8', function(err, data) {
		if (err) throw err;
		res.json(data);
	});
});
app.get('/howMore', (req,res)=>{
	fs.readFile('./textContent/howWeCanHelpMoreText.txt', 'utf8', function(err, data) {
		if (err) throw err;
		res.json(data);
	});
});
//help form and email already done in email section
//Admin
//Post request to update text
//NEEDS authorisation
app.post('/howWeCanHelpText', (req,res)=>{
	fs.writeFile('./textContent/howWeCanHelpText.txt', req.body.mainText, function(err, data) {
  	if (err) throw err;
    res.sendStatus(200);
	});
});
app.post('/howMore', (req,res)=>{
	fs.writeFile('./textContent/howWeCanHelpMoreText.txt', req.body.mainText, function(err, data) {
  	if (err) throw err;
    res.sendStatus(200);
	});
});
//*********************************************************VOLUNTEER*************************************************************
//Get how do I apply tab text
app.get('/howDoIApplyText', (req,res)=>{
	fs.readFile('./textContent/howDoIApplyText.txt', 'utf8', function(err, data) {
  	if (err) throw err;
  	res.json(data);
	});
});
app.get('/volMore', (req,res)=>{
	fs.readFile('./textContent/volMore.txt', 'utf8', function(err, data) {
  	if (err) throw err;
  	res.json(data);
	});
});
//volunteer form and email already done in email section
//more information section needs clarification
//Admin
//Post request to update text
//NEEDS authorisation
app.post('/howDoIApplyText', (req,res)=>{
	fs.writeFile('./textContent/howDoIApplyText.txt', req.body.mainText, function(err, data) {
		if (err) throw err;
    res.sendStatus(200);
	});
});
app.post('/volMore', (req,res)=>{
	fs.writeFile('./textContent/volMore.txt', req.body.mainText, function(err, data) {
  	if (err) throw err;
    res.sendStatus(200);
  });
});
//*********************************************************VIEW*************************************************************
//Need to find a way to changepass page.
app.set('view engine', 'html');
var options = {
	extensions:['css', 'js', 'png', 'json', 'html']
};
app.use(express.static('./', options));
app.get('/', (req,res)=>{
	return res.sendFile(__dirname+'/home.htm');
});

app.listen(80);
module.exports = app;
