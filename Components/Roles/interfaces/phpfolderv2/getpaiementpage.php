<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
  
    $idligne = $data['id'];

    // Fetch product data with category names
    $sql = $pdo->prepare('SELECT p.id_paiement, p.id_bonlivraison, p.id_livreur, p.date_paiement, p.montant_totale, p.moyen_paiement, p.id_client, p.nom_client, p.prenom_client, p.telephone_client, l.nom as nom_livreur, l.prenom as prenom_livreur 
                          FROM paiement p 
                          JOIN livreur l ON p.id_livreur = l.id_livreur 
                          WHERE p.id_livreur = ? 
                          ORDER BY p.date_paiement DESC');
    $sql->execute([$idligne]);
    $userData = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Get the total amount
    $sqll = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale FROM paiement WHERE id_livreur = ?');
    $sqll->execute([$idligne]);
    $totalAmount = $sqll->fetch(PDO::FETCH_ASSOC);

    // Get the top latest 5 clients (corrected query)
    $sqlll = $pdo->prepare('SELECT * FROM paiement WHERE id_livreur = ? ORDER BY date_paiement DESC LIMIT 5');
    $sqlll->execute([$idligne]);
    $topFive = $sqlll->fetchAll(PDO::FETCH_ASSOC);

    if (count($userData) > 0) {
        // Encode and send the response
        echo json_encode(array(
            'message' => 'gotdata',
            'data' => array(
                'montant_totale' => $totalAmount['montant_totale'],
                'userData' => $userData,
                'topFive' => $topFive
            )
        ));
    } else {
        echo json_encode(array(
            'message' => 'nodata',
            'data' => null
        ));
    }

} catch (PDOException $e) {
    echo json_encode(array(
        'message' => 'error',
        'data' => array('error' => 'Database error: ' . $e->getMessage())
    ));
}
?>