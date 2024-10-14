<?php

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch data from the request
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['idlignecommande'];
    $qte = $data['stock'];
    $idprod = $data['idprod'];
   
    if ($id != null) {
        // Fetch the current quantity
        $sqld = $pdo->prepare('SELECT quantiter FROM lignecommande WHERE id_lignecommande = ?');
        $sqld->execute([$id]);
        $result = $sqld->fetch(PDO::FETCH_ASSOC);
        $qtold = $result['quantiter'];

        // Update the lignecommande with the new quantity
        $sql = $pdo->prepare('UPDATE lignecommande SET quantiter = ? WHERE id_lignecommande = ?');
        $sql->execute([$qte, $id]);

        if ($qte > $qtold) {
            $qtnew = $qte - $qtold;
            // Decrease product stock
            $sqlv = $pdo->prepare('UPDATE produit SET quantiter_stock = quantiter_stock - ? WHERE id_produit = ?');
            $sqlv->execute([$qtnew, $idprod]);
        } else {
            $qtnew = $qtold - $qte;
            // Increase product stock
            $sqlv = $pdo->prepare('UPDATE produit SET quantiter_stock = quantiter_stock + ? WHERE id_produit = ?');
            $sqlv->execute([$qtnew, $idprod]);
        }
        echo json_encode(array('message' => 'Data successfully modified'));
    } else {
        echo json_encode(array('message' => 'Data not modified'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}

?>
