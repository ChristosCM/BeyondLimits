function plotGraph(labels, data, ylabel, coloursBackground, coloursBorder){
	var cvs = document.getElementById("myChart")
	var ctx = cvs.getContext('2d');
	ctx.clearRect(0,0,cvs.width,cvs.height);
	cvs.width = 500;
	cvs.height = 500;
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
function main(){
	$.ajax({
		url:'http://localhost:80/plotGraph',
		type: 'GET',
		datatype: 'json',
		success: (data)=>{
			plotGraph(data['labels'], data['data'], data['ylabel'], data['colours'], data['borderColours']);
		}
	});
}
