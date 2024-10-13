<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id= $data['idbon'];
    $sql = $pdo->prepare('SELECT id_commande from bonlivraison where id_bonlivraison=?');
    $sql->execute([$id]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    $ids=reset($response);
    $idv=reset($ids);
    $sqll = $pdo->prepare('SELECT * from lignecommande where id_commande=?');
    $sqll->execute([$idv]);
    $responses = $sql->fetchAll(PDO::FETCH_ASSOC);
    if (count($responses) > 0) {
      
        echo json_encode(array('message' => 'got data','userData'=>$responses));
    } else {
        echo json_encode(array('message' => 'no data retrieved'));
    }

    // For now, just sending a success response
    

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}




?>