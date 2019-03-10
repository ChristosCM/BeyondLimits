$(window).on("load",function loadCarousel() {
		$.get('/home/carousel', function (data) {
			var html = "";
			html += '<div class="carousel-inner" style="background-color:black">';
			jQuery.each(data, function(index, element) {

				if (index == 0) {
					html += '<div class="carousel-item active">';
				}
				else {
					html += '<div class="carousel-item">';
				}
				var fileType = element.file.slice(element.file.indexOf(".") + 1);
				if (fileType == "mp4") {
					//html += '<iframe width="100%" height="670" src="images/home/'+element.file+'" frameborder="0" allowfullscreen></iframe>';
					html += '	<video class="video-fluid" autoplay loop muted>';
					html += '		<source src="images/home/'+element.file+'" type="video/mp4" />';
					html += '	</video>';
				}
				else {
					html += '	<img class="d-block w-100" height="670px" src="images/home/'+element.file+'" alt="Slide '+index+'">';
				}
				html += '	<div class="carousel-caption">';
				html += '		<h3 style="font-size:50px"><font color="'+element.color+'">'+element.title+'</font></h3>';
				html += '		<h4 style="font-size:20px"><font color="'+element.color+'">'+element.subtitle+'</font></h4>';
				html += '	</div>';
				html += '</div>';
			})
			html += '</div>';
			html += '<a class="carousel-control-prev" href="#carouselControls" role="button" data-slide="prev">';
			html += ' 	<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
			html += '	<h4>Previous</h4>';
			html += '	<span class="sr-only">  Previous</span>';
			html += '</a>';
			html += '<a class="carousel-control-next" href="#carouselControls" role="button" data-slide="next">';
			html += '	<h4>Next</h4>';
			html += '	<span class="carousel-control-next-icon" aria-hidden="true"></span>';
			html += '	<span class="sr-only">Next</span>';
			html += '</a>';
			$("#carouselControls").html(html);
			});
	})