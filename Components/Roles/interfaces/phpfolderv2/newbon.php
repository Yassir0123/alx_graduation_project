<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Fetch product data with category names
    
    $sql = $pdo->prepare('SELECT COUNT(id_bonlivraison) FROM bonlivraison');
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

   $ids=reset($response);
   $id=reset($ids);
   if($id==0){
  echo json_encode(1);
   }
   else{
    $sqle = $pdo->prepare('SELECT MAX(id_bonlivraison) as id_bonlivraison FROM bonlivraison');
    $sqle->execute();
    $response = $sqle->fetchAll(PDO::FETCH_ASSOC);
    $ids=reset($response);
    $id=reset($ids);
    $a=$id+1;
    echo json_encode($a);
   }
    // Encode and send the response
   

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>