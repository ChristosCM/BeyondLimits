$(document).ready(function() {
    $.ajax({
        url: "/howDoIApplyText",
        type: "GET",
        datatype:"json",
        success(data){
            $("#volText").html('<p>'+data+'</p>');
        }
        
    })
})