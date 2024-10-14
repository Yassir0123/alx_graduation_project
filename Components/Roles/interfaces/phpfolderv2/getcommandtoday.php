<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $todayDate = date("Y-m-d");

    // Modify the SQL query to select data where date_livraison is equal to today
    $sql = $pdo->prepare('SELECT * FROM commandesachat WHERE seeable = 0 and DATE(date_livraison) =:todayDate');
    $sql->bindParam(':todayDate', $todayDate, PDO::PARAM_STR);
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($response) > 0) {
        echo json_encode(array('message' => 'got data', 'userData' => $response));
    } else {
        echo json_encode(array('message' => 'no data retrieved'));
    }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
