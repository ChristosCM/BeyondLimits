<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

if(isset($_POST['submit'])){
    try{
        $mail= new PHPMailer();


        $mail->IsSMTP(); // telling the class to use SMTP
        $mail->SMTPDebug  = 2;                     // enables SMTP debug information (for testing)
                                                // 1 = errors and messages
                                                // 2 = messages only
        $mail->SMTPAuth   = true;                  // enable SMTP authentication
        $mail->SMTPSecure = "tls";                 
        $mail->Host       = "smtp.gmail.com";      // SMTP server
        $mail->Port       = 587;                   // SMTP port
        $mail->Username   = "testingemailCM@gmail.com";  // username
        $mail->Password   = "testing13.";            // password
        
        $mail->SetFrom('testingemailCM@gmail.com', 'Mailer');
        $fname = $_POST['fname'];
        $lname = $_POST['lname'];
        $email = $_POST['email'];
        $info = $_POST["info"];
        
        $mail->Subject    = "Seeking Help Form by: " . $fname;


        $email_message = "Person Seeking Help<br/><br/>";
        $email_message .= "Form details below.<br/><br/>";
        $email_message .= "<b>First Name:</b> ".($fname)."<br/>";
        $email_message .= "<b>Last Name: </b>".($lname)."<br/>";
        $email_message .= "<b>Email: </b>".($email)."<br/>";
        $email_message .= "<b>Message:</b> ".($info)."<br/>";

        $mail->isHTML(true);
        $mail->Body    = $email_message;
        $mail->AltBody = $email_message;
        
        $address = "nai.chris5@gmail.com";
        $mail->AddAddress($address, "Test");

        if(!$mail->Send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;
        } else {
        echo "Message sent!";
        }
    } catch (Exception $e){
            echo 'Message could not be sent. We apologise for the incovinience. Error: ' , $mail->ErrorInfo;
    }
}
?>

