function loadEvents() {
		$.get('/eventsAll', function (data) {
			var html = "";
			var currentCollapse = "";
			
			if (data.length == 0) {
				html += '<h1 style="font-size:150px;text-align:center;line-height:1.25;>More Events Coming Soon...</h1>';
			}
			else {
				jQuery.each(data, function(index, element) {
					i = index;
					if (index % 3 == 0) {
						html += '<div class="row">';
					}
					
					html += '<div class = "col-md-4">';
					html +=	'	<div class = "events" id = "event'+index+'" style="background-image:url(\''+element.pPath+'\');">';
					html +=	'		<h4>'+element.eventName+'</h4>';
					html +=	'		<button type="button" class="btn btn-primary" id="collapseButton" data-toggle="collapse" data-target="#'+element.idEvents+'">Expand</button>';
					html +=	'	</div>';
					html += '</div>';
					
					currentCollapse += '<div class="collapse" id="'+element.idEvents+'">';
					currentCollapse +=	'	<div class = "cardit card card-body bg-light">';
					currentCollapse += '		<p style="font-size:20pt;"><img src="'+element.pPath+'" class = "rounded-circle event-image" align = "middle">'+element.description+'</p>';
					currentCollapse += '		<p style="position: absolute; bottom: 0px; right: 15px; font-size: 30px;">'+element.date+'</p>';
					currentCollapse += '	</div>';
					currentCollapse += '</div>';
					
					if (index % 3 == 2 || index == data.length - 1) {
						html += '</div>';
						html += '<div class = "row">';
						html += '	<div class = "cardit col-md-auto" style="width:100%">';
						html += currentCollapse;
						html += '	</div>';
						html += '</div>';
					}
					
				})
			}
			$('#eventGrid').html(html);
			});
	}
	
	$(loadEvents());