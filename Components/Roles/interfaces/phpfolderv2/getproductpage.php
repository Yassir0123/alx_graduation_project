<?php

 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   

    // Fetch product data with category names
    
    $sql = $pdo->prepare('SELECT p.id_produit,p.libeller,c.nom_categorie,p.quantiter_stock,p.prix_ht,p.tva,p.image,p.id_fournisseur FROM produit p, categorie c where p.id_categorie=c.id_categorie');
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Encode and send the response
    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>