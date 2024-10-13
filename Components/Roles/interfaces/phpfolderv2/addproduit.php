<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    // Ensure all required fields are provided
    if (isset($data['id_categorie'], $data['id_fournisseur'], $data['libeller'], $data['image'], $data['tva'], $data['prix_ht'], $data['quantiter_stock'])) {
        $category = $data['id_categorie'];
        $idfr = $data['id_fournisseur'];
        $libeller = $data['libeller'];
        $image = $data['image'];
        $tva = $data['tva'];
        $prix_ht = $data['prix_ht'];
        $quantiter = $data['quantiter_stock'];

        $sql = $pdo->prepare('INSERT INTO produit (libeller, quantiter_stock, prix_ht, id_categorie, tva, id_fournisseur, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$libeller, $quantiter, $prix_ht, $category, $tva, $idfr, $image]);

        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('error' => 'Missing required fields'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>

