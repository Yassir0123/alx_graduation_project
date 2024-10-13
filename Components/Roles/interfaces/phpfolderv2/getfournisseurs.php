<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch product data with category names
    $sql = $pdo->prepare('SELECT * FROM fournisseur');
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Add the "action" key with a value of 0 to each row

    // Encode and send the response
    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>