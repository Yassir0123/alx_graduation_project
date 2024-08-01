<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $idligne = $data['id_fournisseur'];
    // Fetch product data with category names
    
    $sql = $pdo->prepare('SELECT * from produit where id_fournisseur=?');
    $sql->execute([$idligne]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Encode and send the response
    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>