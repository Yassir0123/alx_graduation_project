<?php
// Database connection details
$dsn = "mysql:host=localhost;dbname=logicom;charset=utf8mb4";
$username = "root";
$password = "";

// Create a PDO instance
try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

$paymentData = $data['paymentData'];
$bonvaliderData = $data['bonvaliderData'];

// Check if id_vendeur is 0 and set it to NULL if so
$bonvaliderData['id_vendeur'] = ($bonvaliderData['id_vendeur'] == 0) ? null : $bonvaliderData['id_vendeur'];

// Prepare SQL statements
$sql1 = $pdo->prepare('
    INSERT INTO paiement (id_bonlivraison, id_livreur, montant_totale, montant_payer, moyen_paiement, id_client, nom_client, prenom_client, date_paiement, telephone_client) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
');

$sql2 = $pdo->prepare('
    INSERT INTO bonvalider (id_bonlivraison, id_commande, id_operateur, id_livreur, id_commerciale, id_vendeur, id_client, nom_client, prenom_client, localisation, date_livraison, telephone_client, montant_totale) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
');
$sql = $pdo->prepare('update bonlivraison set seeable = 1 where id_bonlivraison = ?');
// Execute SQL statements
$sql->execute([$bonvaliderData['id_bonlivraison']]);

// Bind parameters for the paiement table
$sql1->execute([
    $paymentData['id_bonlivraison'],
    $paymentData['id_livreur'],
    $paymentData['montant_totale'],
    $paymentData['montant_payer'],
    $paymentData['moyen_paiement'],
    $paymentData['id_client'],
    $paymentData['nom_client'],
    $paymentData['prenom_client'],
    $paymentData['date_paiement'],
    $paymentData['telephone_client']
]);

// Bind parameters for the bonvalider table
$sql2->execute([
    $bonvaliderData['id_bonlivraison'],
    $bonvaliderData['id_commande'],
    $bonvaliderData['id_operateur'],
    $bonvaliderData['id_livreur'],
    $bonvaliderData['id_commerciale'],
    $bonvaliderData['id_vendeur'],
    $bonvaliderData['id_client'],
    $bonvaliderData['nom_client'],
    $bonvaliderData['prenom_client'],
    $bonvaliderData['localisation'],
    $bonvaliderData['date_livraison'],
    $bonvaliderData['telephone_client'],
    $bonvaliderData['montant_totale']
]);

// Check if the inserts were successful
if ($sql1->rowCount() > 0 && $sql2->rowCount() > 0) {
    echo json_encode(['message' => 'gotdata']);
} else {
    echo json_encode(['message' => 'error']);
}

$pdo = null; // Close the database connection
?>