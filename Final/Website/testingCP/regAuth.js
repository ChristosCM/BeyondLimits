function resetPass(){
	//Challenge Response Authentication only works for login requests. Example in caAuth.js. Only way
	//to secure the registration is through a HTTPS/SSL certificate.
	$(document).ready(function(){
		var op = $('#OP').val();
		var np = $('#NP').val();
		var cnp = $('#CNP').val();
		if(np == cnp){
			var npDetails = {
				"op": op,
				"np": np,
			}
			$.ajax({
				url:'/changePass',
				type:'POST',
				data:JSON.stringify(npDetails),
				datatype:'json',
				success:function(data){
					console.log("Changed!");
				}
			});
		} else {
			return
		}		
	});
}