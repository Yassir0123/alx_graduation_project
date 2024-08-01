<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id= $data['idlignecommande'];
    $qte=$data['stock'];
    

    if ($id!=null) {
        $sql = $pdo->prepare('update lignecommande set quantiter=? where id_lignecommande=?');
        $sql->execute([$qte,$id]);
       
        echo json_encode(array('data well modifed'));
    } else {
        echo json_encode(array('data not modified'));
    }

    // For now, just sending a success response
    

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>