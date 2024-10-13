<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch product data with category names
    $sql = $pdo->prepare('SELECT MAX(id_fournisseur) as id_fournisseur FROM fournisseur');
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    $idc=reset($response);
    $id=reset($idc);
    // Add the "action" key with a value of 0 to each row

    // Encode and send the response
    echo json_encode($id+1);
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
