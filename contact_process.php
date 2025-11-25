<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    // SMTP settings
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "ayoufellahb14n19@gmail.com";   // بريدك
    $mail->Password = "amak xbtw oaem oalv";           // كلمة مرور التطبيقات
    $mail->SMTPSecure = "tls";
    $mail->Port = 587;

    // Sender & Recipient
    $mail->setFrom($_POST['email'], $_POST['name']);
    $mail->addAddress("ayoufellahb14n19@gmail.com");

    // Content
    $mail->isHTML(true);
    $mail->Subject = $_POST['subject'];
    $mail->Body = nl2br($_POST['message']);

    $mail->send();
    echo "success";
} catch (Exception $e) {
    echo "error: {$mail->ErrorInfo}";
}
?>
