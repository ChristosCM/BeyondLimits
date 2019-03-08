$(window).on("load",function(){
    $.ajax({
        url: "/howDoIApplyText",
        type: "GET",
        datatype:"json",
        success(data){
            $("#volText").html('<p>'+data+'</p>');
        }
        
    })
})
$(window).on("load",function(){
    $.ajax({
        url: "/volMore",
        type: "GET",
        datatype:"json",
        success(data){
            $("#volMoreText").html('<p>'+data+'</p>');
        }
        
    })
})
$(window).on("load",function(){
    $("#volEmail").submit(function(e){
        e.preventDefault();
        var fname = $("#fname").val();
		var lname = $("#lname").val();
		var address1 = $("#address1").val();
		var address2 = $("#address2").val();
		var email = $("#email").val();
		var county = $("#county").val();
        var info = $("#info").val();
        $.ajax({
            url: "/volunteerEmail",
            type: "post",
            data: {"fname": fname, "lname": lname, "address1": address1, "address2": address2, "email": email, "county": county, "info": info},
            success(){
                if(!alert("The form has been sent")){window.location.reload();}
            },
            error(err){
                alert("There was an error while sending your form, please try again later");
            }
        })
    })
})