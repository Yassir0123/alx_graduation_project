<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Check if the operateur is making a GET request with the command ID as a parameter
        if (isset($_GET['command_id'])) {
            $commandId = $_GET['command_id'];

            // Prepare a SQL query to retrieve command information by ID
            $sql = $pdo->prepare('SELECT nom,prenom,id_command,montant_total,date_livraison FROM commande2 WHERE id_commande = :command_id');
            $sql->bindParam(':command_id', $commandId, PDO::PARAM_INT);
            $sql->execute();
            $response = $sql->fetch(PDO::FETCH_ASSOC);

            if ($response !== false) {
                // Command found, return its information
                echo json_encode(array('message' => 'gotdata', 'commandInfo' => $response));
            } else {
                // Command not found
                echo json_encode(array('message' => 'command not found'));
            }
        } else {
            // Invalid request without command ID
            echo json_encode(array('message' => 'invaliid request'));
        }
    } else {
        // Handle other HTTP methods if necessary
        echo json_encode(array('message' => 'unsupported method'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
