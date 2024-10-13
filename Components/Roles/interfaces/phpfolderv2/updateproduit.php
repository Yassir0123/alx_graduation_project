<?php
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = $data['id_produit'];
    $qte = $data['quantiter_stock'];
    $tva = $data['tva'];
    $idcat = $data['categorie'];
    $lib = $data['libelle'];
    $prix = $data['prix_ht'];
    $image = $data['image'];
    $idfr = $data['id_fournisseur'];

    if ($id != null) {
        $sql = $pdo->prepare('UPDATE produit SET libeller=?, quantiter_stock=?, prix_ht=?, tva=?, id_categorie=?, image=?, id_fournisseur=? WHERE id_produit=?');
        $result = $sql->execute([$lib, $qte, $prix, $tva, $idcat, $image, $idfr, $id]);
        
        if ($result) {
            echo json_encode(array('success' => true, 'message' => 'Product updated successfully'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Failed to update product'));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => 'Invalid product ID'));
    }
} catch (PDOException $e) {
    echo json_encode(array('success' => false, 'message' => 'Database error: ' . $e->getMessage()));
}
?>
