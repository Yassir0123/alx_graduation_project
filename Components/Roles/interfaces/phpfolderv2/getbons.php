<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $idligne = $data['id'];
    
    // Fetch product data with category names
    
    $sql = $pdo->prepare('SELECT * from bonlivraison where id_operateur=? ORDER BY id_bonlivraison DESC');
    $sql->execute([$idligne]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
  if(count($response)>0){
    // Encode and send the response
    echo json_encode(array('message'=>'gotdata','userData'=>$response));
  }else{
    echo json_encode(array('message'=>'nodata'));
  }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>