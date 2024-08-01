<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $datr = $data['newdata'];
    
    // Loop through the data array and update quantiter_stock for each product
    foreach ($datr as $item) {
        $id_produit = $item['id_produit'];
        $quantiter = $item['quantity'];
        echo $quantiter;
        // Update quantiter_stock in the commande table
        $sql = $pdo->prepare('UPDATE produit SET quantiter_stock = quantiter_stock - ? WHERE id_produit = ?');
        $sql->execute([$quantiter, $id_produit]);
    }

    // Sending a success response
    echo json_encode(array('message' => 'Quantities updated successfully'));
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
