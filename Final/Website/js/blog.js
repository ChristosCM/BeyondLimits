function readMore(id){
        var dots = document.getElementById("dots"+id);
        var moreText =document.getElementById("more"+id);
        var btn = document.getElementById("btn"+id);
  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btn.innerHTML = "Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btn.innerHTML = "Read less"; 
    moreText.style.display = "inline";
  }

    }
function readMoreTest(id){
    var dots = document.getElementById("Tdots"+id);
        var moreText =document.getElementById("Tmore"+id);
        var btn = document.getElementById("Tbtn"+id);
  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btn.innerHTML = "Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btn.innerHTML = "Read less"; 
    moreText.style.display = "inline";
  }
}
$(document).ready(function(){
    $.ajax({
        url:'http://localhost:80/blogShow',
        type: 'GET',
        datatype: 'json',
        success: (posts)=>{
            for (i=0; i<posts.length; i++){
                console.log(posts[i]);
                var id = posts[i].idposts;
                var btnid = "btn"+id;
                var moreid = "more"+id;
                var dotsid = "dots"+id;
                var preview = posts[i].content.substr(0,20);
                var rest = posts[i].content.substr(20,);
                $("#blist").append('<li><a target="_blank" href="#">'+posts[i].title+ '</a><a href="#" class="float-right">'+posts[i].date+'</a><p>'+preview+'<span id="'+dotsid+'"style="display: inline;">...</span><span id="'+moreid+'"style="display: none;">'+rest+'</span></p><button onclick="readMore('+id+')" id="'+btnid+'">Read more</button></li>');
            }
        }
    });
    $.ajax({
        url:'/testimonialsShow',
        type: 'GET',
        datatype: 'json',
        success: (posts)=>{
            for (i=0; i<posts.length; i++){
                var id = posts[i].idtestimonials;
                var btnid = "Tbtn"+id;
                var moreid = "Tmore"+id;
                var dotsid = "Tdots"+id;
                var preview = posts[i].content.substr(0,20);
                var rest = posts[i].content.substr(20,);

                $("#testlist").append('<li><div class="media" style = "float:bottom;"><div class="media-left media-middle"><a href="#"><img class="media-object mr-3" src="'+posts[i].photo+'" alt="Picture User" height = 100, width = 100></a></div><div class="media-body"><h4 class="media-heading"><a target="_blank" href="#">'+posts[i].name+ '</a></h4><p>'+preview+'<span id="'+dotsid+'"style="display: inline;">...</span><span id="'+moreid+'"style="display: none;">'+rest+'</span></p><button onclick="readMoreTest('+id+')" id="'+btnid+'">Read more</button></div></li>');
            }
        }
    });
});

