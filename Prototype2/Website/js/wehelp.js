$(document).ready(function() {
    $.ajax({
        url: "/howWeCanHelpText",
        type: "GET",
        datatype:"json",
        success(data){
            $("#home").html('<h3>About Our Services</h3>'+'<p>'+data+'</p>');
        }
        
    })
})