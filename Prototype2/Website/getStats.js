var mysql = require('mysql');

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

function randRGB(i,a){
	var colours = []
	for(var x = 0; x<i; x++){
		var r = Math.floor((Math.random()*255)+1);
		var g = Math.floor((Math.random()*255)+1);
		var b = Math.floor((Math.random()*255)+1);
		colours.push('rgba('+ r +', ' + g + ', ' + b + ',' + a + ')');
	}
	return colours
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
		password: ""
	});
	//use the connection to get data, get colours depending on number of people, and then plot graph
	if(x == "Event"){
		if(y == "Volunteers"){

		} else if(y == "Attendance"){

		}
		
	} else if(x == "Volunteers") {
		//Do something else here.
	}


	
}