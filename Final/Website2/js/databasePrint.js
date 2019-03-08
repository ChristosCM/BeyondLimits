$.ajax({
	type:"get",
    url: "/tablesAll",
    success(res){
    	function capitalizeFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
  		for (object in res){
  			$("#tables").append("<div>" + capitalizeFirstLetter(object) + "</div>");
  			$("#tables").append("<div><table id = '"+object+"'>");
  			$("#"+object).append("<tr id = 'heading"+object+"'></tr>");
			for (heading in res[object][0]){
				$("#heading"+object).append("<th style = 'width:130px'>" + heading + "</th>");
			}
			var id = 0;
			for(record in res[object]){
				var values = Object.values(res[object][record]);
				$("#"+object).append("<tr id = '"+object+id+"'></tr>");
				for(entry in values){
					$("#"+object+id).append("<td style = 'width:130px'>"+values[entry]+"</td>");
				}
				id+=1;
			}
  			$("#tables").append("</table></div>");
  			$("#tables").append("<br>");
  		}      
    },
    error(err){
        console.log(err);
        alert("There was an error processing your request");
    }
})
function printPage(){
	var restorepage = $('body').html();
	var printcontent = $('#tables').clone();
	$('body').empty().html(printcontent);
	window.print();
	$('body').html(restorepage);
}