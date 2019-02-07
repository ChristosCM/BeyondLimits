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
//ajax to post the blog from the admin tab: Blog
$(document).ready(function(){
  $("#blogForm").submit(function(e){
      e.preventDefault();
      var title =  $("#beditort").val();
      var content = $("#beditor").val();
      //maybe add if for empty, but they might want it empty
      $.ajax({
          url: "/blogPost",
          type: "post",
          data: {"title": title, "content": content},
          datatype: "json",
          success(){
              alert("New Blog Post has been posted");
          },
          error(){
              alert("There was an error posting the blog")
          }

      });
  });
});
$(document).ready(function(){
  $("#testimonialForm").submit(function(e){
      e.preventDefault();
      var name =  $("#testname").val();
      var content = $("#testeditor").val();
      $.ajax({
          url: "/testimonialsPost",
          type: "post",
          data: {"name": name, "content": content},
          datatype: "json",
          success(){
            if(!alert('The Testimonial has been posted')){window.location.reload();}
          },
          error(){
              alert("There was an error posting the testimonial")
          }

      });
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
  var male = $("#volunteersMale").val();
  var female = $("#volunteersFemale").val();
  $.ajax({
    url:'/createEvent',
    type : 'post',
    data: {"attendance": attendance, "name": title, "description": description, "date": date, "vTotal": volunteers,"vMale": male, "vFemale": female},
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
function eventEdit(id){
  $.ajax({
    url:'/eventsAll',
    type: 'get',
    datatype: 'json',
    success(events){
      for (i=0; i<events.length; i++){
        if (events[i].idEvents ==id){
          var event = events[i];
        }
      }
      console.log(event);
      $('#eventTitle').val(event.eventName);
      $('#description').val(event.description);
      $('#eventDate').val(event.date);
      $('#attendance').val(event.attendance);
      $('#volunteersTotal').val(event.volunteerTotal);
      $('#volunteersMale').val(event.volunteerMale);
      $('#volunteersFemale').val(event.volunteerFemale);
      $("#eventSubmit").hide();
      $('#divEventEdit').html('<button class="btn btn-info" onclick="eventEditPost('+id+')">Edit Event</button>');

    }
  })
}
function eventDelete(id){
  $.ajax({
    url:'/deleteEvent/'+id,
    type: 'post',
    success(){
      if(!alert("Event has been deleted")){window.location.reload();}

    },
    error(){
      console.log(error);
    }

  })
}
function eventEditPost(id){
  var title = $("#eventTitle").val();
  var description = $("#description").val();
  var date = $("#eventDate").val();
  var attendance = $("#attendance").val();
  var volunteers = $("#volunteersTotal").val();
  var male = $("#volunteersMale").val();
  var female = $("#volunteersFemale").val();

  $.ajax({
    url:'/createEvent/'+id,
    type : 'post',
    data: {"attendance": attendance, "name": title, "description": description, "date": date, "vTotal": volunteers, "vMale": male, "vFemale": female},
    datatype : 'json',
    success: () => {
      if(!alert("Event has been edited")){window.location.reload();}

    },
    error(err){
      console.log(err);
      alert("There was an error creating the event" + err);
    }
  });
}

 function blogEdit(id){
  $.ajax({
    url:'/blogShow',
    type : 'GET',
    datatype : 'json',
    success: (posts) => {
      for (i=0; i<posts.length; i++){
        if (posts[i].idposts ==id){
          var post = posts[i];
        }
      }
      $('#beditort').val(post.title);
      $('#beditor').val(post.content);
      $('#blogPostButton').prop('disabled', true);
      $('#blogPostButton').hide();
      $('#blEdDiv').html('<button class="btn btn-info" id = "blogEditPostButton" onclick="blogEditPost('+id+')">Edit Post</button>');
    }
  });
}
function blogEditPost(id){
  var title =  $("#beditort").val();
  var content = $("#beditor").val();
  $.ajax({
    url:'/blogPost/'+id, 
    type: 'POST',
    data: {"title": title, "content": content},
    datatype: 'json',
    success: ()=>{
      if(!alert("The Blog Post has been edited")){window.location.reload();}

          //right now the page gets resent so no use for these functions yet
    },
    error(err){
        console.log(error);
    }
  });
}
function testimonialsDelete(id){
  if (confirm('Are you sure you want to delete this testimonial post from the website?')) {
    
  $.ajax({
    url:'/testimonialsDelete/'+id ,
    type: 'POST',
    datatype: 'json',
    success: function() {
      if(!alert("The Testimonial Post has been deleted")){window.location.reload();}

    }
    });
} else {

    }
}
function testimonialsEdit(id){
  $.ajax({
    url:'http://localhost:80/testimonialsShow',
    type : 'GET',
    datatype : 'json',
    success: (posts) => {

      for (i=0; i<posts.length; i++){
        if (posts[i].idtestimonials ==id){
          var post = posts[i];
        }
      }
      $('#testname').val(post.name);
      $('#testeditor').val(post.content);
      $('#submitTestForm').prop('disabled', true);
      $('#submitTestForm').hide();
      $('#testEditDiv').html('<button class="btn btn-info" id = "blogEditPostButton" onclick="testEditPost('+id+')">Edit Post</button>');
    }
  });
}
function testEditPost(id){
  var title =  $("#testname").val();
  var content = $("#testeditor").val();
  console.log(id,title,content);
  $.ajax({
    url:'/testimonialsPost/'+id, 
    type: 'POST',
    data: {"name": title, "content": content},
    datatype: 'json',
    success: ()=>{
      if(!alert("The Testimonial Post has been edited")){window.location.reload();}
          //right now the page gets resent so no use for these functions yet
    },
    error(err){
        console.log(error);
    }
  });
}
function blogPost(){
  var title =  $("#beditort").val();
  var content = $("#beditor").val();
  $.ajax({
    url:'http://localhost:80/blogPost/', 
    type: 'POST',
    data: {"title": title, "content": content},
    datatype: 'json',
    sucess(){
          //right now the page gets resent so no use for these functions yet
    },
    error(err){
        console.log(error);
    }
  });

}
  
  function blogDelete(blogID){
    if (confirm('Are you sure you want to save this thing into the database?')) {
      $.ajax({
        url:'http://localhost:80/blogDelete/'+blogID, 
        type: 'POST',
        datatype: 'json',
        success: function(result) {
          if(!alert('the Blog Post has been deleted')){window.location.reload();}
        }
        });
      // Save it!
  } else {
      // Do nothing!
  }
      }
  $("upload").click(function(){
    $.ajax({
      url:'http://localhost:80/fileUpload',
      type: 'POST',
      datatype: 'json'
    })
  })

