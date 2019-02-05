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
$(document).ready(function(){
  $("#blogForm").submit(function(e){
      e.preventDefault();
      var title =  $("#beditort").val();
      var content = $("#beditor").val();
      //maybe add if for empty, but they might want it empty
      $.ajax({
          url: "/howMore",
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
      $('#blogPostButton').hide();
      $('#blEdDiv').html('<button class="btn btn-info" onclick("blogEditPost('+id+'); return false")>Edit Post</button>');
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
    sucess(){
      return false;
          //right now the page gets resent so no use for these functions yet
    },
    error(err){
        console.log(error);
      

    }
    
  
  });
  return false;
}
function testimonialsDelete(id){
  $.ajax({
      url:'/testimonialsDelete/'+id ,
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
      for (i=0; i<posts.length; i++){
        if (posts[i].idposts ==id){
          var post = posts[i];
        }
      }
      $('#name').value = post.name;
      $('#testeditor').value = post.content;
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

