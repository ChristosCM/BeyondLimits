$(document).ready(function() {
	$('.nav-tabs').click(function(){
		$('.nav-tabs').on('shown.bs.tab', 'a', function(e) {
	        $(e.target).removeClass('active');
	    }); 
	});
});