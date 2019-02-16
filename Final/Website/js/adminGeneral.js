$(function(){
  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-tabs a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});
$(document).ready(function () {
    $("#editoraboutus").editor({
      uiLibrary: 'bootstrap4'
    });
  });
  $(document).ready(function () {
    $("#editorhome").editor({
      uiLibrary: 'bootstrap4'
    });
  });
  $(document).ready(function () {
    $("#editorHowWe").editor({
      uiLibrary: 'bootstrap4'
    });
  });
  $(document).ready(function () {
    $("#editorMore").editor({
      uiLibrary: 'bootstrap4'
    });
  });
  $(document).ready(function () {
    $("#editorVol").editor({
      uiLibrary: 'bootstrap4'
    });
  });
  $(document).ready(function () {
    $("#editorVolMore").editor({
      uiLibrary: 'bootstrap4'
    });
  });
  $(document).ready(function(){
    $.ajax({
        url: "/howWeCanHelpText",
        type: "get",
        success(data){
            $("#editorHowWe").editor().content(data);
        },
        error(err){
            alert("There was problem getting the content from the page: " + err);
        }
    })
    $.ajax({
        url: "/howMore",
        type: "get",
        success(data){
            $("#editorMore").editor().content(data);
        },
        error(err){
            alert("There was problem getting the content from the page: " + err);
        }
    })
    $.ajax({
        url: "/volMore",
        type: "get",
        success(data){
            $("#editorVolMore").editor().content(data);
        },
        error(err){
            alert("There was problem getting the content from the page: " + err);
        }
    })
})
$(document).ready(function(){
    $.ajax({
        url: "/aboutUsText",
        type: "get",
        success(data){
            $("#editoraboutus").editor().content(data);
        },
        error(err){
            alert("There was problem getting the content from the page: " + err);
        }
    })
})
$(document).ready(function(){
    $.ajax({
        url: "/howDoIApplyText",
        type: "get",
        success(data){
            $("#editorVol").editor().content(data);
        },
        error(err){
            alert("There was problem getting the content from the page: " + err);
        }
    })
})

  //aboutUSupload
  $(document).ready(function(){
      $("#aboutUpload").submit(function(e){
          e.preventDefault();
          var text = $("#editoraboutus").val();
          //maybe add if for empty, but they might want it empty
          if (confirm('Are you sure you want to change the About Us text?')){
          $.ajax({
              url: "/aboutUsText",
              type: "post",
              data: {"mainText": text},
              success(){
                if(!alert("About Us section has been altered")){window.location.reload();}
              },
              error(){
                  alert("There was an error updating the section")
              }

          });
        }
      });
  });
  //how we can help upload
  $(document).ready(function(){
    $("#howWeUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorHowWe").val();
        //maybe add if for empty, but they might want it empty
        if (confirm('Are you sure you want to change the How We Can Help text?')){
        $.ajax({
            url: "/howWeCanHelpText",
            type: "post",
            data: {"mainText": text},
            success(){
                if(!alert("How We Can Help section has been altered")){window.location.reload();}
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    }
    });
});
$(document).ready(function(){
    $("#howMoreUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorMore").val();
        //maybe add if for empty, but they might want it empty
        if (confirm('Are you sure you want to change the More information text on the How We Can Help section?')){
        $.ajax({
            url: "/howMore",
            type: "post",
            data: {"mainText": text},
            success(){
                if(!alert("More Information (on How We Can Help) section has been altered")){window.location.reload();}
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    }
    });
});
//volunteer upload
$(document).ready(function(){
    $("#volUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorVol").val();
        //maybe add if for empty, but they might want it empty
        if (confirm("Are you sure you want to change the Volunteer text?")){
        $.ajax({
            url: "/howDoIApplyText",
            type: "post",
            data: {"mainText": text},
            success(){
                if(!alert("How Do I Apply section has been altered")){window.location.reload();}
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    }
    });
});
$(document).ready(function(){
    $("#volMoreUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorVolMore").val();
        //maybe add if for empty, but they might want it empty
        if (confirm("Are you sure you want to change the More Information on the Volunteer page?")){
        $.ajax({
            url: "/volMore",
            type: "post",
            data: {"mainText": text},
            success(){
                if(!alert("More Information (on How Do I Help) section has been altered")){window.location.reload();}
                if(!alert()){window.location.reload();}
                
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    }
    });
});
