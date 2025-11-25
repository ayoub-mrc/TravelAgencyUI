<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';

try {
    // SMTP settings
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = 'html';

    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "ayoubfellahb14n19@gmail.com";   // بريدك
    $mail->Password = "mjgoyrkmluzluopa";           // كلمة مرور التطبيقات
    $mail->SMTPSecure = "tls";
    $mail->Port = 587;

    // Sender & Recipient
    $mail->setFrom("ayoubfellahb14n19@gmail.com", "ASAFAR Contact");

    // Reply-To 
    $mail->addReplyTo($_POST['email'], $_POST['name']);

    // Recipient 
    $mail->addAddress("ayoubfellahb14n19@gmail.com");


    // Content
    $mail->isHTML(true);
    $mail->Subject = $_POST['subject'];
    $mail->Body = nl2br($_POST['message']) ?? 'Message from contact form';

    $mail->send();
    echo "success";
} catch (Exception $e) {
    echo "error: {$mail->ErrorInfo}";
}
?>
