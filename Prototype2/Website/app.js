//Need to go back over these methods to ensure that they can only be called by DOM elements or people
//with adequate level of clearance to do so.
const mime = require('mime-types');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
var squel = require("squel");

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
  return String(string).replace(pattern, function(match, index) {
  	if(Number.isInteger(args[index])){
  		return args[index];
  	} else {
  		return '"'+args[index]+'"';
  	}
  });
};


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
	var fname = req.headers.fname;
	var lname = req.headers.lname;
	var address1 = req.headers.address1;
	var address2 = req.headers.address2;
	var email = req.headers.email;
	var county = req.headers.county;
	var info = req.headers.info;
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
	var fname = req.headers.fname;
	var lname = req.headers.lname;
	var email = req.headers.email;
	var info = req.headers.info;
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
	var title = req.headers.title;
	var content = req.headers.content;
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
	var title = req.headers.title;
	var content = req.headers.content;
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

//This is the version for editing the testimonials.
app.post('/testimonialsPost/:id', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	//Implement picture upload. I have a copy of this on my PP coursework.
	var tID = req.params.id;
	var name = req.headers.tName;
	var content = req.headers.content;
	var picPath = req.headers.pPath;
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
		
		return res.status(200).sendFile(__dirname + '/adminPage.html');;
	});
});
app.post('/testimonialsPost', (req,res) =>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	//Implement picture upload. I have a copy of this on my PP coursework.
	var name = req.headers.tName;
	var content = req.headers.content;
	var picPath = req.headers.pPath;
	var sql = format("INSERT INTO testimonials (name,content,photo) VALUES (%1,%2,%3)", name, content, picPath);
	queryDB(con, sql, function(err, result){
		if(err) throw err;
		con.end();
	});
	return res.status(200).sendFile(__dirname + '/adminPage.html');
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

app.post('/fileUpload', (req,res) => {
	if(req.files){
		var file = req.files.filename;
		if(String(mime.lookup(file)).includes("image")){
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

//This is the version for the editing events.
app.post('/createEvent/:id', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var eID = req.params.id;
	var eventName = req.headers.name;
	var attendance = req.headers.attendance;
	var volunteerTotal = req.headers.vTotal;
	var volunteerMale = req.headers.vMale;
	var volunteerFemale = req.headers.vFemale;
	//This should work but needs further testing.
	var sql = format("DELETE FROM events WHERE idEvents = %1;", eID);
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		con.end();
		var con1 = setupConnection("localhost", "root", "password", "blDB");
		var sql = format("INSERT INTO events (idEvents,eventName,attendance,volunteerTotal,volunteerMale,volunteerFemale) VALUES (%1,%2,%3,%4,%5,%6)", eID, eventName, attendance, volunteerTotal, volunteerMale, volunteerFemale);
		queryDB(con1,sql,function(err1,result1){
			if(err1) throw err1;
			con1.end();
		});
		//Using this on the client side could create JS to iterate over all posts.
		
		return res.sendStatus(200);
	});
});

//This is the version for creating events.
app.post('/createEvent', (req,res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var eventName = req.headers.name;
	var attendance = req.headers.attendance;
	var volunteerTotal = req.headers.vtotal;
	var volunteerMale = req.headers.vmale;
	var volunteerFemale = req.headers.vfemale;
	var sql = format("INSERT INTO events (eventName,attendance,volunteerTotal,volunteerMale,volunteerFemale) VALUES (%1,%2,%3,%4,%5)", eventName, attendance, volunteerTotal, volunteerMale, volunteerFemale);
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		//Using this on the client side could create JS to iterate over all posts.
		con.end()
		return res.sendStatus(200);
	});
});

app.post('/deleteEvent/:id', (req, res)=>{
	var con = setupConnection("localhost", "root", "password", "blDB");
	var eID = req.params.id;
	//Delete the event by ID
	var sql = format("DELETE FROM events WHERE idEvents = %1", parseInt(eID));
	queryDB(con, sql, function(err,result){
		if(err) throw err;
		con.end();
		return res.sendStatus(200);
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
		var table = req.headers.qTable;
		var operators = req.headers.operators;
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
				whereStream += " " + operators[i-1] + " ";
			}
			whereStream += conditions[cond];
			i+=1;
		}
		s.where(whereStream);
		return s.toString();
	}
	function insertQ(fields, values){
		var table = req.headers.qTable;
		var s = squel.insert();
		s.into(table);
		for(var i = 0; i<values.length; i++){
			s.set(fields[i], values[i]);
		}
		return s.toString();
	}

	function deleteQ(conditions){
		var table = req.headers.qTable;
		var operators = req.headers.operators;
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
				whereStream += " " + operators[i-1] + " ";
			}
			whereStream += conditions[cond];
			i+=1;
		}
		s.where(whereStream);
		return s.toString();
	}
	function updateQ(fields, values, whereStream){
		var table = req.headers.qTable;
		var s = squel.update();
		s.table(table);
		for(var i = 0; i<values.length; i++){
			s.set(fields[i], values[i]);
		}
		s.where(whereStream);
		return s.toString();
	}


	//Type of query is passed
	var type = req.headers.qType;
	//Switch based on type
	switch(type){
		case "SELECT":
			//Get all the conditions together on the client side. The format required
			//is given above in the selectQ function.
			var conditions = req.headers.conditions;
			var query = selectQ(conditions);
			queryDB(con, query, function(err,result){
				return res.status(200).send(result);
				con.end();
			});
			break;
		case "INSERT":
			//req.headers.conditions is a list of lists
			var fields = req.headers.conditions[0];
			var values = req.headers.conditions[1];
			var query = insertQ(fields, values);
			queryDB(con, query, function(err,result){
				return res.sendStatus(200);
				con.end();
			});
			break;
		case "UPDATE":
			//req.headers.conditions is a list of lists
			var fields = req.headers.conditions[0];
			var values = req.headers.conditions[1];
			var withStream = req.headers.conditions[2];
			var query = updateQ(fields, values, withStream);
			queryDB(con, query, function(err,result){
				return res.sendStatus(200);
				con.end();
			});
			break;
		case "DELETE":
			var conditions = req.headers.conditions;
			var query = deleteQ(conditions);
			queryDB(con, query, function(err,result){
				return res.sendStatus(200);
				con.end();
			});
			break;
	}
});

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
module.exports = app;