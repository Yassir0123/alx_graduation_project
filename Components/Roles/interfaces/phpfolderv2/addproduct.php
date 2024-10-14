<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    $idprod = $data['idprod'];
    $category = $data['category'];
    $libeller = $data['libeller'];
    $idcmd = $data['idcmd'];
    $tva = $data['tva'];
    $prix_ht = $data['prix_ht'];
    $quantiter = $data['quantiter'];

    // Check if idcmd is provided and not null
    if ($idcmd !== null) {
        $sql = $pdo->prepare('INSERT INTO lignecommande (id_commande, libeller, quantiter, prix, nom_categorie, tva, id_produit) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$idcmd, $libeller, $quantiter, $prix_ht, $category, $tva, $idprod]);
        $sql = $pdo->prepare('update produit set quantiter_stock=quantiter_stock-? where id_produit=?');
        $sql->execute([$quantiter,$idprod]);
        // Return a success message or the newly inserted ID if needed
        echo json_encode(array('message' => 'Data inserted successfully'));
    } else {
        echo json_encode(array('error' => 'idcmd is missing or null'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
