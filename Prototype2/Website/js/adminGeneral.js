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

  //aboutUSupload
  $(document).ready(function(){
      $("#aboutUpload").submit(function(e){
          e.preventDefault();
          var text = $("#editoraboutus").val();
          //maybe add if for empty, but they might want it empty
          $.ajax({
              url: "/aboutUsText",
              type: "post",
              data: {"mainText": text},
              success(){
                  alert("About Us section has been altered");
              },
              error(){
                  alert("There was an error updating the section")
              }

          });
      });
  });
  //how we can help upload
  $(document).ready(function(){
    $("#howWeUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorHowWe").val();
        //maybe add if for empty, but they might want it empty
        $.ajax({
            url: "/howWeCanHelpText",
            type: "post",
            data: {"mainText": text},
            success(){
                alert("How We Can Help section has been altered");
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    });
});
$(document).ready(function(){
    $("#howMoreUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorMore").val();
        //maybe add if for empty, but they might want it empty
        $.ajax({
            url: "/howMore",
            type: "post",
            data: {"mainText": text},
            success(){
                alert("More Information (on How We Can Help) section has been altered");
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    });
});
//volunteer upload
$(document).ready(function(){
    $("#volUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorVol").val();
        //maybe add if for empty, but they might want it empty
        $.ajax({
            url: "/howDoIApplyText",
            type: "post",
            data: {"mainText": text},
            success(){
                alert("How Do I Apply section has been altered");
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    });
});
$(document).ready(function(){
    $("#volMoreUpload").submit(function(e){
        e.preventDefault();
        var text = $("#editorVolMore").val();
        //maybe add if for empty, but they might want it empty
        $.ajax({
            url: "/volMore",
            type: "post",
            data: {"mainText": text},
            success(){
                alert("More Information (on How Do I Help) section has been altered");
            },
            error(){
                alert("There was an error updating the section")
            }

        });
    });
});