<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Specify the columns you want to select
    $sql = $pdo->prepare('SELECT id_livreur, nom, prenom, addresse, date_naissance, email FROM livreur');
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($response) > 0) {
        echo json_encode(array('message' => 'gotdataLivreurhere', 'userData' => $response));
    } else {
        echo json_encode(array('message' => 'nodata retrieved'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>

