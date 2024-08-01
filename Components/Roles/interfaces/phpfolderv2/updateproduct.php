<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id= $data['id_produit'];
    $qte=$data['quantiter_stock'];
    $tva= $data['tva'];
    $idcat=$data['categorie'];
    $lib= $data['libelle'];
    $prix=$data['prix_ht'];
    

    if ($id!=null) {
        $sql = $pdo->prepare('UPDATE produit set libeller=?,quantiter_stock=?,prix_ht=?,tva=?,id_categorie=? where id_produit=?');
        $sql->execute([$lib,$qte,$prix,$tva,$idcat,$id]);
       
        echo json_encode(array('data well modifed'));
    } else {
        echo json_encode(array('data not modified'));
    }

    // For now, just sending a success response
    

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>