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
      $("#footerMain").html(mainHTML);
      $("#footerEmail").html(emailAddress);
      $("#footerEmail").attr("href", "mailto:e-mail: " + emailAddress)
      $("#footerPhone").html(phoneNumber);
      $("#footerFacebook").attr("href", facebookLink)
    }
  })
})
