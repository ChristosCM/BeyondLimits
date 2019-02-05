function createTable(array) {
    table = '<h4>Columns of Selected Table</h4><table class="table table-hover"><thead class="thead-light"><tr>';
    for (i=0; i<array.length; i++){
        table+='<th>'+array[i]+'</th>';
    }
    table += '</thead></table>'
    $("#data").html(table);
    $("#data").show();

}
function selectRes(array) {
    if (array.length){
        table = '<hr class="half-rule"><h4>Items matching your search:</h4><table class="table table-hover"><thead class="thead-light"><tr>';
        for (var key in array[0]){
            table+='<th>'+key+'</th>';
        }
        table +=  '</tr></thead><tbody>';
        for (i=0; i<array.length; i++){
            table += '<tr>'
            for (var key in array[i]){
                table+='<th>'+array[i][key]+'</th>';
        }
        table += '</tr>'
    }
        table += '</thead></table>'
        $("#dataQ").html(table)
    }else{
        var msg = '<hr class="half-rule"><center><h4>No results are matching your search</h4></center>'
        $("#dataQ").html(msg)
    }


}
function select(array){
    temp = '<form id="selectForm"><select class="form-control" id="selectOptions">';
    for (i=0; i<array.length; i++){
        temp += '<option>'+array[i]+'</option>';
    }
    temp += '</select><input type="text" id="selectText" ><select form="selectForm" id="selectOperator" class="form-control"><option value="AND">AND</option><option selected value="OR">OR</option></select><input type="text" id="selectText2"><button type="button" class="btn btn-info" onclick="query()">Search</button></form>';
    $("#typeForm").html(temp);
}
function deleteFn(array){
    temp = '<select class="form-control" id="deleteOptions">';
    for (i=0; i<array.length; i++){
        temp += '<option>'+array[i]+'</option>';
    }
    temp += '</select>';
    $("#typeForm").html(temp);
}
function insert(array){
    table = '<h4>Insert Values</h4><form id="insertForm" name="insertForm"><div class="form-group"><table class="table table-hover"><thead class="thead-light"><tr>';
    for (i=0; i<array.length; i++){
        table+='<th>'+array[i]+'</th>';
    }
    table += '</tr></thead>'
    table += '<tbody><tr>';
    for (i=0; i<array.length; i++){
        table+='<td><input id="insertText'+i+'"form="insertForm" type=text></td>';
    }
    table += '</table><button onclick="query()" class="btn btn-success" >Submit</button></div></form>'
    $("#typeForm").html(table);
    $("#data").hide();
}

function query(){
    var table = $("#tables").val();
    var type = $("#type").val();

    if (!column){
        //make every column if none is selected
    }
    if (type=="SELECT"){
        var column = $("#selectOptions").val();
        var text1 = $("#selectText").val();
        var text2 = $("#selectText2").val();
        var operator;
        var values = [];
        if (text1){
            if (typeof(text1) === typeof(" ")){
                console.log("works");
                values.push(column+"="+"'"+text1+"'");
                console.log(values);

            }else{
                values.push(column+'='+text1);
                console.log(values);

            }
        }
        if (text2){
            var operator = $("#selectOperator").val();
            if (typeof(text2) === typeof(" ")){
                values.push(column+"='"+text2+"'");
            }else{
                values.push(column+'='+text2);
            }        
        }

        $.ajax({
            type:"post",
            url: "/query",
            data: {"qtable": table,"qtype": type,"operators": operator, "conditions": values},
            success(content){
                selectRes(content);
            },
            error(err){
                console.log(err);
                alert("There was an error processing your request");
            }


        })
    //problem with INSERT and getting the inputs of the generated lists: brute force solution: assign input ids while generating them and then iterate through them
    }else if(type=="INSERT"){
        

        var fields = document.forms["insertForm"].getElementsByTagName("input").length;
        var values = [];
        for (i=0; i<fields; i++){
            values.push($("#insertText"+i).val());
        }
        //maybe need to add the fields to the values
        $.ajax({
            url: "/query",
            type: "post",
            headers: {"qtable": table, "qtype": type, "conditions": values}
        })
    }else if (type =="DELETE"){

    }
                
    //need to add the delete function
}
//function to get table columns from the database and call the appropriate functon based on the type of query that they want to run
  function showCol(){
    var table = $("#tables").val();
    var type = $("#type").val();
    $.ajax({
        url: "/colSQL",
        type: "get",
        datatype: "json",
        success(data){
            createTable(data[table]);
            if (type =="SELECT"){
                select(data[table]);
            }else if (type =="DELETE"){
                deleteFn(data[table]);
            }else if (type == "INSERT"){
                insert(data[table]);
            } 
        },
        error(error){
            alert("There was an error: "+ error);
        }
    
    })
}
$(document).ready(function(){
    $("#insertForm").submit(function(e){
        e.preventDefault();
        query()
    })
})
//these functions have to do with the graphs in statistics 
//initialising the options
$(document).ready(function(){
   $("#monthsDrop").attr("selected","selected");
   $("#p1").removeAttr("disabled","disabled");
    $("#p5").removeAttr("disabled","disabled");
   $("#p1").attr("selected","selected");
    $("#p2").attr("disabled","disabled");
    $("#p3").attr("disabled","disabled");
    $("#p4").attr("disabled","disabled");
    

    plotSet();
});
//selecting and removing options depending on xAXIS options
function plotSet(){
    if($("#monthsDrop").prop("selected")){
        $("#p1").removeAttr("disabled","disabled");
        $("#p5").removeAttr("disabled","disabled");
        $("#p1").attr("selected","selected");
        $("#p2").attr("disabled","disabled");
        $("#p3").attr("disabled","disabled");
        $("#p4").attr("disabled","disabled");
        

    }else if($("#eventsDrop").prop("selected")){
        $("#p1").removeAttr("disabled","disabled");
        $("#p2").removeAttr("disabled","disabled");
        $("#p1").attr("selected","selected");
        $("#p3").attr("disabled","disabled");
        $("#p4").attr("disabled","disabled");
        $("#p5").attr("disabled","disabled");

    }else if($("#volunteerDrop").prop("selected")){
        $("#p4").removeAttr("disabled","disabled");
        $("#p4").attr("selected","selected");
        $("#p1").attr("disabled","disabled");

        $("#p2").attr("disabled","disabled");
        $("#p3").attr("disabled","disabled");
        $("#p4").attr("disabled","disabled");
        $("#p5").attr("disabled","disabled");
    }
    plot();
}
//function to get data and labels and plot the graphs on the Statistics tab in the Admin Page
function plot(){
    var x = $("#xaxis").val();
    var y = $("#yaxis").val();
    $.ajax({
        url: "/plotGraph/"+x+"/"+y,
        type: "get",
        success(gc){
        $('#chart').remove(); // this is my <canvas> element
        $('#canvasContain').append('<canvas id="chart"><canvas>');
        var cvs = document.getElementById("chart")
	    var ctx = cvs.getContext('2d');
	    ctx.clearRect(0,0,cvs.width,cvs.height);
	    cvs.width = 600;
	    cvs.height = 600;
        //var ctx = document.getElementById("chart").getContext("2d");
        var chart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: gc.labels,
        datasets: [{
            label: gc.ylabel,
            data: gc.data,
            backgroundColor: gc.colours,
            borderColor: gc.borderColours,
            borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
        },
        error(err){

        }
    })
}