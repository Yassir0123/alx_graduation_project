<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    $category = $data['idcat'];
    $libeller = $data['libelle'];
    $tva = $data['tva'];
    $prix_ht = $data['prix'];
    $quantiter = $data['qte'];
    $image = $data['image'];
    $four=$data['fournisseur'];
    // Check if idcmd is provided and not null

        $sql = $pdo->prepare('INSERT INTO produit ( libeller, quantiter_stock, prix_ht, id_categorie, tva,image,id_fournisseur) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$libeller,$quantiter,$prix_ht,$category,$tva,$image,$four]);


} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
