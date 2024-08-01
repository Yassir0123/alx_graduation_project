<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

$data = json_decode(file_get_contents("php://input"));

$recipientEmail = $data->email;
$passw=$data->passw;

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0; // Enable verbose debug output for troubleshooting (set to 2 for detailed debugging)
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'mzakyassir@gmail.com'; // Your Gmail email address
    $mail->Password = 'vhlugopykuhempvh'; // Your Gmail password or app-specific password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Recipients
    $mail->setFrom('mzakyassir@gmail.com', 'Yassir Mzak');
    $mail->addAddress($recipientEmail);

    // Content
    $mail->isHTML(false);
    $mail->Subject = 'Reset Your Password'; // Update subject

    $emailBody = "Here's your reset code :".$passw;
    $mail->Body = $emailBody;

    $mail->send();
    $response = ['success' => true];
} catch (Exception $e) {
    $response = ['success' => false, 'error' => $mail->ErrorInfo];
}

echo json_encode($response);
?>
