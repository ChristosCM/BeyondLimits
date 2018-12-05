<?php 
if(isset($_POST['submit'])){
     



    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        //echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
 
 
    // if(!isset($_POST['fname']) ||
    //     !isset($_POST['lname']) ||
    //     !isset($_POST['email']) ||
    //     !isset($_POST['address1']) ||
    //     !isset($_POST['info'])) {
    //     died('We are sorry, but there appears to be a problem with the form you submitted.');       
    // }
    

    $to = "nai.chris5@gmail.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    $first_name = $_POST['fname'];
    $last_name = $_POST['lname'];
    $address1 = $_POST["address1"];
    $address2 = $_POST["address2"];
    $county = $_POST["county"];
    $info = $_POST["info"];

    $subject = "Form submission";
    //$subject2 = "Copy of your form submission";

    
    // $message2 = "Here is a copy of your message " . $first_name . "\n\n" . $_POST['info'];


    // $error_message = "";
    // if(strlen($error_message) > 0) {
    //     died($error_message);
    //   }
    $email_message = "VOLUTEER\n\n";
    $email_message .= "Form details below.\n\n";
    $email_message .= "First Name: ".($first_name)."\n";
    $email_message .= "Last Name: ".($last_name)."\n";
    $email_message .= "Email: ".($from)."\n";
    $email_message .= "Address: ".($address1)." ";
    $email_message .= ($address2)." ";
    $email_message .= ($county)."\n";
    $email_message .= "Message: ".($info)."\n";

    
    $headers = "From:" . $from;
    $headers2 = "From:" . $to;
    mail($from,$subject,$email_message,$headers);
    if(mail($to,$subject,$email_message,$headers)){}
        echo "<script>alert('Email Successfully Sent');</script>";
    }else{
        echo "<script>aler('There was a problem');</script>";
    }

?>

