<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $idligne = $data['id_categorie'];
    // Fetch product data with category names based on the received id_categorie
    $sql = $pdo->prepare('SELECT p.id_produit, p.libeller, c.nom_categorie, p.quantiter_stock, p.prix_ht, p.tva, p.image FROM produit p, categorie c WHERE p.id_categorie = ? AND p.id_categorie = c.id_categorie');
    $sql->execute([$idligne]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Encode and send the response
    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>