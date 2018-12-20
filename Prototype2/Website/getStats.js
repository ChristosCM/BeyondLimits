var mysql = require('mysql');
var express = require('express');
var app = express();

function plotGraph(labels, data, ylabel, coloursBackground, coloursBorder){
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
			  labels: labels,
			  datasets: [{
			    label: ylabel,
			    data: data,
			    backgroundColor: coloursBackground,
			    borderColor: coloursBorder,
			    borderWidth: 1
			  }]
			},
			options: {
			  scales: {
			    yAxes: [{
			      ticks: {
			        beginAtZero:true
			      }
			    }]
			  },
			  legend: {
			    display: false
			  },
			  responsive: false
			}
		});
}

function randRGB(i){
	var colours = []
	var borderColours
	for(var x = 0; x<i; x++){
		var r = Math.floor((Math.random()*255)+1);
		var g = Math.floor((Math.random()*255)+1);
		var b = Math.floor((Math.random()*255)+1);
		colours.push('rgba('+ r +', ' + g + ', ' + b + ', 0.4)');
		borderColours.push('rgba('+ r +', ' + g + ', ' + b + ', 1)');
	}
	return colours, borderColours
}

function queryDB(con, sql, callback){
	con.connect(function(err){
		if(err) throw err;
		con.query(sql, function(error, res){
			if(error) throw error;
			callback(error, res);
		});
		console.log("Connected");
	});
}

//Takes in some value from an input; can program this later
//x is the field from the dropdown that they are plotting against frequency
//y defines what we will compare x to; attendees, volunteers, ...
//Would be stored on the server side; would need to be addressed in html as such.
function freqPlot(x,y){
	//x the dropdown option refers to the table we are using.
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "password",
		database: 'blDB'
	});
	//use the connection to get data, get colours depending on number of people, and then plot graph
	if(x == "Event"){
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
				plotGraph(labels,data,ylabel,colours,borderColours);
				con.end();
			});
		} else if(y == "Attendance"){

		}
		
	} else if(x == "Volunteers") {
		//Do something else here.
	}
}
app.get('/plotGraph', (req, res) =>{
	freqPlot('Event', 'Volunteers');
	//Find a way to render a graph on the page. This is working but
	//Is sending the user to another page. This should not be happening.
	res.sendStatus(200);
});


app.listen(80);
module.exports = app;