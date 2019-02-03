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
    table = '<h4>Items matching your search:</h4><table class="table table-hover"><thead class="thead-light"><tr>';
    for (i=0; i<array.length; i++){
        table+='<th>'+array[i]+'</th>';
    }
    table += '</thead></table>'
    $("#dataQ").html(table)

}
function select(array){
    temp = '<select class="form-control" id="selectOptions">';
    for (i=0; i<array.length; i++){
        temp += '<option>'+array[i]+'</option>';
    }
    temp += '</select><input type="text" id="selectText"><button type="button" onclick="query()">Look Up</button>';
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
    table = '<h4>Insert Values</h4><form id="insertForm" onsubmit="query(); return false" ><div class="form-group"><table class="table table-hover"><thead class="thead-light"><tr>';
    for (i=0; i<array.length; i++){
        table+='<th>'+array[i]+'</th>';
    }
    table += '</tr></thead>'
    table += '<tbody><tr>';
    for (i=0; i<array.length; i++){
        table+='<td><input form="insertForm" type=text></td>';
    }
    table += '</table><button type="submit" name = "submit" class="btn btn-success" onclick+"query" value="Submit">Submit</button></div></form>'
    $("#typeForm").html(table);
    $("#data").hide();
}
function update(array){
    //not sure if this is really needed
    return false
}

function query(){
    var table = $("#tables").val();
    var type = $("#type").val();
    
    if (!column){
        //make every column if none is selected
    }
    if (type=="SELECT"){
        var column = $("#selectOptions");
        var text = $("#selectText");
        $.ajax({
            type:"get",
            url: "/query",
            headers: {
                "qTable": table,
                "operators": [column,text],

            },
            success(data){
                console.log(data);
                selectRes(data);
            },
            error(err){
                alert("There was an error processing your request");
            }


        })
    //problem with INSERT and getting the inputs of the generated lists: brute force solution: assign input ids while generating them and then iterate through them
    }else if(type=="INSERT"){
        var allInputs = $( "#insertForm input:text" );
        var values = [];
        console.log(allInputs["0"].val());
        for (i=0; allInputs.length; i++)
            values.push();
        // $("insertFrom").each(function(){
        //    console.log($(this).find('input')); //<-- Should return all input elements in that specific form.
        // });
    }
    //need to add the delete function
}
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
            } else if (type == "UPDATE"){
                update(data[type]);
            }
        },
        error(error){
            alert("There was an error: "+ error);
        }
    
    })
}

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
//function to get data and labels and plot the graphs
function plot(){
    var x = $("#xaxis").val();
    var y = $("#yaxis").val();
    $.ajax({
        url: "/plotGraph/"+x+"/"+y,
        type: "get",
        success(gc){
        var ctx = document.getElementById("chart").getContext("2d");
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