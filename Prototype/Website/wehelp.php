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
 
 
    if(!isset($_POST['fname']) ||
        !isset($_POST['lname']) ||
        !isset($_POST['email']) ||
        !isset($_POST['info'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted.');       
    }

    $to = "nai.chris5@gmail.com.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    $first_name = $_POST['fname'];
    $last_name = $_POST['lname'];
    $info = $_POST["info"];


    $subject = "Form submission";


    $email_message = "Person who seeks help\n\n";
    $email_message .= "Form details below.\n\n";
    $email_message .= "First Name: ".($first_name)."\n";
    $email_message .= "Last Name: ".($last_name)."\n";
    $email_message .= "Email: ".($from)."\n";
    $email_message .= "Message: ".($info)."\n";

    $headers = "From:" . $from;

    mail($to,$subject,$email_message,$headers);
    echo "Message was successfully sent";
    
    
    
}