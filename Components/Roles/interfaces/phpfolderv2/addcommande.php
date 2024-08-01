<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    $idcom = $data['id_commerciale'];
    $idvend = $data['id_vendeur'];
    $idclient = $data['id_client'];
    $idcmd = $data['idcmdcount'];
    $montant = $data['montanttotale'];
    $date = $data['date_livraison'];
    $nom = $data['nom'];
    $prenom = $data['prenom'];
    $localisation = $data['localisation'];

    // Check if idcmd is provided and not null

        $sql = $pdo->prepare('INSERT INTO commande2 (id_commande, id_vendeur, id_client, id_commerciale, montant_totale, date_livraison, localisation,nom_client,prenom_client) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$idcmd, $idvend, $idclient, $idcom, $montant, $date, $localisation,$nom,$prenom]);
        
        // Return a success message or the newly inserted ID if needed
        echo json_encode(array('message' => 'Data inserted successfully'));
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
