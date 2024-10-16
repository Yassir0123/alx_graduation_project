<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $idligne = $data['id'];
    $sql = $pdo->prepare('SELECT cin,id_livreur,nom,prenom from livreur where id_livreur=?');
    $sql->execute([$idligne]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    if (count($response) > 0) {
      
        echo json_encode(array('message' => 'gotdata','userData'=>$response));
    } else {
        echo json_encode(array('message' => 'nodata retrieved'));
    }

    // For now, just sending a success response
    

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}







?>