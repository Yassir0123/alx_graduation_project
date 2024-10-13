<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    $cat=$data['id_produit'];

   $sql=$pdo->prepare('DELETE from produit where id_produit=?');
   $result  = $sql->execute([$cat]);
   if ($result) {
    echo json_encode(array('success' => true, 'message' => 'Product updated successfully'));
} else {
    echo json_encode(array('success' => false, 'message' => 'Failed to update product'));
}
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>