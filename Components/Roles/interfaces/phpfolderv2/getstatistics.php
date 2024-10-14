<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['userid'];
    $email = $data['email'];
    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);

    $isVendor = ($domain == "vendeur.com");
    $idField = $isVendor ? 'id_vendeur' : 'id_commerciale';

    // Total cmd valider
    $sql = $pdo->prepare("SELECT COUNT(*) as count FROM commande2 WHERE $idField = ?");
    $sql->execute([$id]);
    $cmdvalider = $sql->fetch(PDO::FETCH_ASSOC);

    // Total MT valider
    $sql = $pdo->prepare("SELECT COALESCE(SUM(montant_totale), 0) as montant_totale FROM bonvalider WHERE $idField = ?");
    $sql->execute([$id]);
    $mtvalider = $sql->fetch(PDO::FETCH_ASSOC);
    $mtvalider['montant_totale'] = number_format($mtvalider['montant_totale'], 2, ',', ' ');

    // Total Products sold
    $sql = $pdo->prepare("SELECT SUM(lc.quantiter) as total_products 
                          FROM commande c 
                          JOIN lignecommande lc ON c.id_commande = lc.id_lignecommande 
                          WHERE c.$idField = ?");
    $sql->execute([$id]);
    $totalProducts = $sql->fetch(PDO::FETCH_ASSOC);
    $totalmontant = $totalProducts['total_products'] ?? 0;

    // TotalMT per date
    $sql = $pdo->prepare("SELECT SUM(montant_totale) as montant_totale, date_livraison as date_commande 
                          FROM commande 
                          WHERE $idField = ? 
                          GROUP BY date_livraison");
    $sql->execute([$id]);
    $totalmtdate = $sql->fetchAll(PDO::FETCH_ASSOC);
    foreach ($totalmtdate as &$row) {
        $row['montant_totale'] = number_format($row['montant_totale'], 2, ',', ' ');
    }

    // Totalcmd per date
    $sql = $pdo->prepare("SELECT COUNT(id_commande) as commandes, date_livraison as date_commande 
                          FROM commande 
                          WHERE $idField = ? 
                          GROUP BY date_livraison");
    $sql->execute([$id]);
    $totalcmddate = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Send the response as JSON
    echo json_encode([
        'message' => 'Data retrieved successfully',
        'totalProductsSold' => $totalmontant,
        'totalCommandsValidated' => $cmdvalider['count'],
        'totalAmountValidated' => $mtvalider['montant_totale'],
        'totalmtdate' => $totalmtdate,
        'totalcmddate' => $totalcmddate
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}