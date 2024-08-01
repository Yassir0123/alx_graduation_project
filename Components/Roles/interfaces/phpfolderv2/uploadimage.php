<?php
header('Access-Control-Allow-Origin: *');
$target_path = "C:/xampp/htdocs/logo/Components/Roles/interfaces/Products/img/";

$target_file = $target_path . basename($_FILES['file']['name']);

if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
    $data = ['success' => true, 'filePath' => 'img/' . basename($_FILES['file']['name'])]; // Modify the filePath
    echo json_encode($data);
} else {
    $data = ['success' => false, 'message' => 'Upload and move not success'];
    echo json_encode($data);
}

?>
