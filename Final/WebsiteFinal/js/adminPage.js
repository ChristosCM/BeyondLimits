//showing the events
$(window).on("load",function(){
$.ajax({
	url:'/eventsAll',
	type: 'GET',
	datatype: 'json',
	success: (events)=>{
		for (i=0; i<events.length; i++){
			$("#eventsTable").append('<tr><td>'+events[i].eventName+'</td><td>'+events[i].date+'</td><td>'+events[i].attendance+'</td><td>'+events[i].volunteerTotal+'</td><td><button onclick = "eventDelete('+events[i].idEvents+')" class="btn btn-danger">Delete</button><div class = "divider1"></div><button  onclick ="eventEdit('+events[i].idEvents+')" class="btn btn-info">Edit</button></td></tr>');
		}
	}
});
  $.ajax({
    url:'/home/carousel',
    type: 'GET',
    datatype:'json',
    success: (images)=>{
      $("#sliderIm").html('<label class = "control-label" for="index">Pick the position that the image is going to be added (see table below)</label><input type="range" min="0" value="0" max="'+(images.length)+'"class="slider" name="index"id="index" oninput="printChange(this.value);" ></input><p>Position: <span id="pos">0</span></p>')
      for (i=0; i<images.length; i++){
        var fileType = images[i].file.slice(images[i].file.indexOf(".") + 1);
        if (fileType == "mp4") {
          $("#carTable").append('<tr><td>'+images[i].file+'</td><td><video class="video-fluid"  width="100" height="100" autoplay loop muted>	<source src="images/home/'+images[i].file+'" type="video/mp4" /></video></td><td><button onclick = "carDelete('+i+')" class="btn btn-danger">Delete</button><div class = "divider1"></div></td></tr>')
        }else{
        $("#carTable").append('<tr><td>'+images[i].file+'</td><td><img width="100px" height="100px"src="images/home/'+images[i].file+'"</td><td><button onclick = "carDelete('+i+')" class="btn btn-danger">Delete</button><div class = "divider1"></div></td></tr>');
        }
      }
    },
    error: (err)=>{
      alert("There was an error getting the images from the database");
    }
  })
  $.ajax({
	url:'/blogShow',
	type: 'GET',
	datatype: 'json',
	success: (posts)=>{
		for (i=0; i<posts.length; i++){
      $("#btable").append('<tr><td>'+posts[i].title+'</td><td>'+posts[i].date+'</td><td><button onclick = "blogDelete('+posts[i].idposts+')" class="btn btn-danger">Delete</button><div class = "divider1"></div><button  onclick ="blogEdit('+posts[i].idposts+')" class="btn btn-info">Edit</button></td></tr>');
		}
	}
});
$.ajax({
	url:'/testimonialsShow',
	type: 'GET',
	datatype: 'json',
	success: (testimonials)=>{
		for (i=0; i<testimonials.length; i++){
			$("#testTable").append('<tr><td>'+testimonials[i].name+'</td><td><button onclick = "testimonialsDelete('+testimonials[i].idtestimonials+')" class="btn btn-danger">Delete</button><div class = "divider1"></div><button  onclick ="testimonialsEdit('+testimonials[i].idtestimonials+')" class="btn btn-info">Edit</button></td></tr>');
		}
	}
});
$.ajax({
	url:'/user',
	type: 'GET',
	datatype: 'json',
	success: (username)=>{
		console.log(username);
		$("#logUsername").text("Logged in as " + username);
	}
});
});
//ajax to post the blog from the admin tab: Blog
$(window).on("load",function(){
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
            if(!alert("New blog post has been uploaded")){window.location.reload();}
          },
          error(){
              alert("There was an error posting the blog")
          }

      });
  });
});
    function printChange(value){
      console.log(value);
        $("#pos").empty().text(value);
    }
    $(window).on("load",function(){
  $("#testimonialForm").submit(function(e){
    e.preventDefault();
    $(this).ajaxSubmit({
      error: function(err){
        alert("There was an error: "+ err);
      },
      success: function(){
        if(!alert("The testimonial has been uploaded successfully")){window.location.reload();}
      }
    })
    return false;
  })
})
// $(document).ready(function(){
//   $("#testimonialForm").submit(function(e){
//       e.preventDefault();
//       var name =  $("#testname").val();
//       var content = $("#testeditor").val();
//       $.ajax({
//           url: "/testimonialsPost",
//           type: "post",
//           data: {"name": name, "content": content},
//           datatype: "json",
//           success(){
//             if(!alert('The Testimonial has been posted')){window.location.reload();}
//           },
//           error(){
//               alert("There was an error posting the testimonial")
//           }

//       });
//   });
// });
$(window).on("load",function(){
  $("#newCarousel").submit(function(e){
    e.preventDefault();
    $(this).ajaxSubmit({
      error: function(xhr) {
        alert('There was an error: ' + xhr.status);
         },

         success: function() {
          if(!alert("The image has been uploaded successfully")){window.location.reload();}
         }

    })
    return false;
  })
})
$(window).on("load",function() {
  $('#eventPost').submit(function(e) {
    e.preventDefault();
    var submit = true;
    if (($("#eventTitle").val().length==0) || ($("#description").val()==null)||($("#eventDate").val()==null)){
      submit = false;
      alert("Please fill out all the fields");
    }
    if (($("#attendance").val().length==0)||($("#attendance").val()>("99999999999"))){
      submit = false;
    }
    if (($("#volunteersTotal").val().length==0)||($("#volunteersTotal").val()>("99999999999"))){
      submit = false;
    }
    if (($("#volunteersMale").val().length==0)||($("#volunteersMale").val()>("99999999999"))){
      submit = false;
    }
    if (($("#volunteersFemale").val().length==0)||($("#volunteersFemale").val()>("99999999999"))){
      submit = false;
    }
    if(document.getElementsByName("eventImage")[0].files[0].size){
      var size = document.getElementsByName("eventImage")[0].files[0].size;
      if (size > 999999){
        alert("The file you have submitted is too big");
        submit = false;
      }
    }
    

    if (submit){
     $(this).ajaxSubmit({

         error: function(xhr) {
        alert('Error: ' + xhr.status);
         },

         success: function() {
          if(!alert("The event has been created successfully")){window.location.reload();}
         }
 });
  }else{
    alert("Please check the details again");
  }
     //Very important line, it disable the page refresh.
 return false;
 });
});
function eventEditPost(id){
  $("#eventPost").ajaxSubmit({url: '/createEvent/'+id,
    error: function(err){
      alert("There was an Error"+ err);
    },
    success: function(){
      if(!alert("The event has been edited successfully")){window.location.reload();}

    }
  })
  return false;
}
//old ajax form submit, new one is above so that it works with the image uploader
// $(document).ready(function(){
//   $("#eventPost").submit(function(e){
//     e.preventDefault();
//   var title = $("#eventTitle").val();
//   var description = $("#description").val();
//   var date = $("#eventDate").val();
//   var attendance = $("#attendance").val();
//   var volunteers = $("#volunteersTotal").val();
//   var male = $("#volunteersMale").val();
//   var female = $("#volunteersFemale").val();
//   var file = ($("#eventImage"));

//   $.ajax({
//     url:'/createEvent',
//     type : 'post',
//     data: {"attendance": attendance, "name": title, "description": description, "date": date, "vTotal": volunteers,"vMale": male, "vFemale": female, "file":file},
//     cache: false,
//     contentType: false,
//     processData: false,
//     success: () => {
//       alert("Event has been created");
//     },
//     error(err){
//       console.log(err);
//       alert("There was an error creating the event" + err);
//     }
//   });
// });
// });


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
      $("#eventsCreate").collapse('show');

    }
  })
}
function eventDelete(id){
  console.log(id);
  $.ajax({
    url:'/deleteEvent/'+id,
    type: 'post',
    success(){
      if(!alert("Event has been deleted")){window.location.reload();}

    },
    error(xhr){
      if(!alert("There was an error while deleting the event, please try again.")){window.location.reload();}
    }

  })
}
// function eventEditPost(id){
//   var title = $("#eventTitle").val();
//   var description = $("#description").val();
//   var date = $("#eventDate").val();
//   var attendance = $("#attendance").val();
//   var volunteers = $("#volunteersTotal").val();
//   var male = $("#volunteersMale").val();
//   var female = $("#volunteersFemale").val();

//   $.ajax({
//     url:'/createEvent/'+id,
//     type : 'post',
//     data: {"attendance": attendance, "name": title, "description": description, "date": date, "vTotal": volunteers, "vMale": male, "vFemale": female},
//     datatype : 'json',
//     success: () => {
//       if(!alert("Event has been edited")){window.location.reload();}

//     },
//     error(err){
//       console.log(err);
//       alert("There was an error creating the event" + err);
//     }
//   });
// }
function carDelete(index){
  $.ajax({
    url:'/admin/deleteHomeCarousel',
    method: 'post',
		datatype : 'json',
    data:{index: index},
    success: () => {
      if(!alert("The Carousel Image has been deleted")){window.location.reload();}
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
    url:'/testimonialsShow',
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
        $("#testimonialForm").ajaxSubmit({url: '/testimonialsPost/'+id,
          error: function(err){
            alert("There was an Error"+ err);
          },
          success: function(){
            if(!alert("The testimonial has been edited successfully")){window.location.reload();}

          }
        })
        return false;
      }
// function testEditPost(id){
//   var title =  $("#testname").val();
//   var content = $("#testeditor").val();
//   $.ajax({
//     url:'/testimonialsPost/'+id,
//     type: 'POST',
//     data: {"name": title, "content": content},
//     datatype: 'json',
//     success: ()=>{
//       if(!alert("The Testimonial Post has been edited")){window.location.reload();}
//           //right now the page gets resent so no use for these functions yet
//     },
//     error(err){
//         console.log(error);
//     }
//   });
// }
function blogPost(){
  var title =  $("#beditort").val();
  var content = $("#beditor").val();
  $.ajax({
    url:'/blogPost/',
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
        url:'/blogDelete/'+blogID,
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
      url:'/fileUpload',
      type: 'POST',
      datatype: 'json'
    })
  })
