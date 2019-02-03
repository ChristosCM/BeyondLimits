$(document).ready(function() {
    $.ajax({
        url: "/aboutUsText",
        type: "GET",
        datatype:"json",
        success(data){
            $("#aboutText").html('<p>'+data+'</p>');
        }
        
    })
})