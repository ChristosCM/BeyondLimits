$(document).ready(function(){
	$('.nav-tabs').on('shown.bs.tab', 'a', function (e) {
	    if (e.relatedTarget) {
	        $(e.relatedTarget).removeClass('active');
	    }
	});
});