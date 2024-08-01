<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    $id = $data['userid'];
    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);

    if ($domain == "vendeur.com") {
        $sql = $pdo->prepare('SELECT * FROM commande WHERE id_vendeur=?');
    } else{
        $sql = $pdo->prepare('SELECT * FROM commande   WHERE id_commerciale=?');
    }
    $sql->execute([$id]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    if (count($response) > 0) {
      
        echo json_encode(array('message' => 'got data','userData'=>$response));
    } else {
        echo json_encode(array('message' => 'no data retrieved'));
    }

    // For now, just sending a success response
    

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>