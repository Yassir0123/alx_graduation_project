<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get today's date in yyyy-mm-dd format
    $todayDate = date("Y-m-d");

    // Prepare and execute the SQL query to fetch data where date is equal to today's date
    $sql = $pdo->prepare('SELECT * FROM commande2 WHERE DATE(date_livraison) = :todayDate ');
    $sql->bindParam(':todayDate', $todayDate, PDO::PARAM_STR);
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Iterate through $response and update statuts if not equal to "valider"
    foreach ($response as &$row) {
        if ($row['statuts'] !== "Valider") {
            $row['statuts'] = "Non Valider";
        }
    }

    // Prepare and execute the SQL query to fetch data where date is less than today's date and statuts is null
    $sql2 = $pdo->prepare('SELECT * FROM commande2 WHERE DATE(date_livraison) < :todayDate');
    $sql2->bindParam(':todayDate', $todayDate, PDO::PARAM_STR);
    $sql2->execute();
    $responser = $sql2->fetchAll(PDO::FETCH_ASSOC);

    // Filter rows in $responser where statuts is not equal to "Valider"
    $filteredResponser = array_filter($responser, function($row) {
        return $row['statuts'] !== "Valider";
    });
    foreach ($responser as &$row) {
        if ($row['statuts'] !== "Valider") {
            $row['statuts'] = "Non Valider";
        }
    }

    if (count($response) > 0 || count($filteredResponser) > 0) {
        // Encode and send the response with both sets of data
        echo json_encode(array('message' => 'gotdata', 'userData' => $response, 'userDatas' => array_values($filteredResponser)));
    } else {
        echo json_encode(array('message' => 'nodata'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>