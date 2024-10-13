<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id= $data['idcmdcount'];
    $sql = $pdo->prepare('SELECT l.id_lignecommandeachat as id_lignecommandeachat, l.id_commandeachat as id_commandeachat, l.libeller as libeller, l.prix as prix, l.quantiter as quantiter, l.nom_categorie as nom_categorie, l.tva as tva, l.id_produit as id_produit,p.image as images from lignecommandeachat l,produit p where id_commandeachat=? and l.id_produit=p.id_produit');
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