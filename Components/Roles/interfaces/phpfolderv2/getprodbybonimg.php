<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['idbon'];

    // Prepare and execute the first query to get the id_commande from bonlivraison
    $sql = $pdo->prepare('SELECT id_commande FROM bonlivraison WHERE id_bonlivraison = ?');
    $sql->execute([$id]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Extract the id_commande
    if (count($response) > 0) {
        $ids = reset($response);
        $id_commande = $ids['id_commande'];
        // Prepare and execute the second query to get details from lignecommande and join with produit
        $sqll = $pdo->prepare('
            SELECT 
                lc.id_lignecommande,
                lc.id_commande,
                lc.libeller,
                lc.prix,
                lc.quantiter,
                lc.nom_categorie,
                lc.tva,
                p.image
            FROM lignecommande lc
            INNER JOIN produit p ON lc.id_produit = p.id_produit
            WHERE lc.id_commande = ?
        ');
        $sqll->execute([$id_commande]);
        $responses = $sqll->fetchAll(PDO::FETCH_ASSOC);

        if (count($responses) > 0) {
            echo json_encode(array('message' => 'got data', 'userData' => $responses));
        } else {
            echo json_encode(array('message' => 'no data retrieved'));
        }
    } else {
        echo json_encode(array('message' => 'no id_commande found'));
    }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
