$(window).on("load",function(){
  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-tabs a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});
$(window).on("load",function(){
  $("#editoraboutus").editor({
    uiLibrary: 'bootstrap4'
  });
});
$(window).on("load",function() {
  $("#editorhome").editor({
    uiLibrary: 'bootstrap4'
  });
});
$(window).on("load",function(){
  $("#editorHowWe").editor({
    uiLibrary: 'bootstrap4'
  });
});
$(window).on("load",function(){
  $("#editorMore").editor({
    uiLibrary: 'bootstrap4'
  });
});
$(window).on("load",function(){
  $("#editorVol").editor({
    uiLibrary: 'bootstrap4'
  });
});
$(window).on("load",function() {
  $("#editorVolMore").editor({
    uiLibrary: 'bootstrap4'
  });
});
$(window).on("load",function() {
  $("#footerEditor").editor({
    uiLibrary: 'bootstrap4'
  });
});
  $(window).on("load",function(){
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
$(window).on("load",function(){
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
$(window).on("load",function(){
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
  $(window).on("load",function(){
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
  $(window).on("load",function(){
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
$(window).on("load",function(){
    $("#howMoreUpload").submit(function(e){
        console.log(1);
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
$(window).on("load",function(){
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
$(window).on("load",function(){
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
                if(!alert("More Information (on Volunteer) section has been altered")){window.location.reload();}
                if(!alert()){window.location.reload();}

            },
            error(){
                alert("There was an error updating the section")
            }

        });
    }
    });
});
//populate current content of footer editor
$(window).on("load",function() {
  $.ajax({
    url: "/footer",
    type: "GET",
    datatype:"json",
    success(data){
      var mainHTML = data.main;
      var emailAddress = data.email;
      var phoneNumber = data.phone;
      var facebookLink = data.facebook;
      $("#footerEditor").editor().content(mainHTML);
      $("#footerEmail").val(emailAddress);
      $("#footerPhone").val(phoneNumber);
      $("#footerFacebook").val(facebookLink);
    }
  })
});
$(window).on("load",function(){
  $("#submitFooterForm").submit(function(e){
    console.log(1);
    e.preventDefault();
    var newMain = $("#footerEditor").val();
    var newEmail = $("#footerEmail").val();
    var newPhone = $("#footerPhone").val();
    var newFacebook = $("#footerFacebook").val();
    //maybe add if for empty, but they might want it empty
    if (confirm('Are you sure you want to change the Footer section?')){
      $.ajax({
        url: "/footer",
        type: "post",
        data: {
          main: newMain,
          email: newEmail,
          phone: newPhone,
          facebook: newFacebook
        },
        success(){
          if(!alert("Footer section has been altered")){window.location.reload();}
        },
        error(){
          alert("There was an error updating the section")
        }
      });
    }
  });
});
