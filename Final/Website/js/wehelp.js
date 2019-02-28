$(window).on("load",function(){
    $.ajax({
        url: "/howWeCanHelpText",
        type: "GET",
        datatype:"json",
        success(data){
            $("#home").html('<h3>About Our Services</h3>'+'<p>'+data+'</p>');
        }
        
    })
})

$(window).on("load",function(){
    $("#helpEmail").submit(function(e){
        e.preventDefault();
        var fname = $("#fname").val();
		var lname = $("#lname").val();
		var email = $("#email").val();
		var county = $("#county").val();
        var info = $("#info").val();
        $.ajax({
            url: "/volunteerEmail",
            type: "post",
            data: {"fname": fname, "lname": lname, "email": email, "county": county, "info": info},
            success(){
                if(!alert("The form has been sent.")){window.location.reload();}
            },
            error(err){
                alert("There was an error while sending your form, please try again later");
            }
        })
    })
})