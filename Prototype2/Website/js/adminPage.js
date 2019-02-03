//showing the events
$(document).ready(function(){
$.ajax({
	url:'http://localhost:80/eventsAll',
	type: 'GET',
	datatype: 'json',
	success: (events)=>{
		for (i=0; i<events.length; i++){
			$("#eventsTable").append('<tr><td>'+events[i].eventName+'</td><td>'+events[i].date+'</td><td>'+events[i].attendance+'</td><td>'+events[i].volunteerTotal+'</td><td><button onclick = "eventDelete('+events[i].idEvent+')" class="btn btn-danger">Delete</button><div class = "divider1"></div><button  onclick ="eventEdit('+events[i].idEvents+')" class="btn btn-info">Edit</button></td></tr>');
		}
	}
});
  
  $.ajax({
	url:'http://localhost:80/blogShow',
	type: 'GET',
	datatype: 'json',
	success: (posts)=>{
		for (i=0; i<posts.length; i++){
      $("#btable").append('<tr><td>'+posts[i].title+'</td><td>'+posts[i].date+'</td><td><button onclick = "blogDelete('+posts[i].idposts+')" class="btn btn-danger">Delete</button><div class = "divider1"></div><button  onclick ="blogEdit('+posts[i].idposts+')" class="btn btn-info">Edit</button></td></tr>');
      console.log("new");
		}
	}
});
$.ajax({
	url:'http://localhost:80/testimonialsShow',
	type: 'GET',
	datatype: 'json',
	success: (testimonials)=>{
		for (i=0; i<testimonials.length; i++){
			$("#testTable").append('<tr><td>'+testimonials[i].name+'</td><td><button onclick = "testimonialsDelete('+testimonials[i].idtestimonials+')" class="btn btn-danger">Delete</button><div class = "divider1"></div><button  onclick ="testimonialsEdit('+testimonials[i].idtestimonials+')" class="btn btn-info">Edit</button></td></tr>');
		}
	}
});
});
$(document).ready(function(){
  $("#eventPost").submit(function(e){
    e.preventDefault();
  var title = $("#eventTitle").val();
  var description = $("#description").val();
  var date = $("#eventDate").val();
  var attendance = $("#attendance").val();
  var volunteers = $("#volunteersTotal").val();
  $.ajax({
    url:'/createEvent',
    type : 'post',
    data: {"attendance": attendance, "name": title, "description": description, "date": date, "volunteersTotal": volunteers},
    datatype : 'json',
    success: () => {
      alert("Event has been created");
    },
    error(err){
      console.log(err);
      alert("There was an error creating the event" + err);
    }
  });
});
});
 function blogEdit(id){
  $.ajax({
    url:'http://localhost:80/blogShow',
    type : 'GET',
    datatype : 'json',
    success: (posts) => {
      var post = posts.id = [id];
      $('#beditort').value = post.title;
      $('#beditor').value = post.content;
    }
  });
}
function testimonialsDelete(id){
  $.ajax({
      url:'http://localhost:80/testimonialsDelete/'+id ,
	    type: 'POST',
	    datatype: 'json',
      success: function(result) {

      }
      });
}
function testimonialEdit(id){
  $.ajax({
    url:'http://localhost:80/testimonialsShow',
    type : 'GET',
    datatype : 'json',
    success: (posts) => {
      var post = posts.id = [id];
      $('#name').value = post.name;
      $('#testeditor').value = post.content;
    }
  });
}
  function blogPost(blogID){
    var title =  $("#beditort").val();
    var content = $("#beditor").val();
    $.ajax({
      url:'http://localhost:80/blogPost/'+blogID, 
      type: 'POST',
      data: {"title": title, "content": content},
      datatype: 'json',
      sucess(){
            //right now the page gets resent so no use for these functions yet
      },
      error(err){
        if (err){
          console.log(error);
        }

      }
      

    });
  }
  function testimonialsPost(testID){
    var name =  $("#testname").val();
    var content = $("#testeditor").val();
    $.ajax({
      url:'http://localhost:80/blogPost/'+testID, 
      type: 'POST',
      data: {"name": name, "content": content},
      datatype: 'json',
      sucess(){
            //right now the page gets resent so no use for these functions yet
      },
      error(err){
        if (err){
          console.log(error);
        }

      }
      

    });
  }
  function blogDelete(blogID){
    $.ajax({
      url:'http://localhost:80/blogDelete/'+blogID, 
	    type: 'POST',
	    datatype: 'json',
      success: function(result) {

      }
      });
  }
  $("upload").click(function(){
    $.ajax({
      url:'http://localhost:80/fileUpload',
      type: 'POST',
      datatype: 'json'
    })
  })

