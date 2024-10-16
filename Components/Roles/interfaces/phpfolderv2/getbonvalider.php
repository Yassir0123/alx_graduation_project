<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
   
    // Fetch product data with category names
    
    $sql = $pdo->prepare('SELECT * from bonvalider');
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
  if(count($response)>0){
    // Encode and send the response
    echo json_encode(array('message'=>'got data','userData'=>$response));
  }else{
    echo json_encode(array('message'=>'nodata'));
  }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}







?>