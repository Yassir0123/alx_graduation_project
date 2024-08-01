<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['nom'], $data['prenom'], $data['localisation'], $data['idvend'], $data['userid'], $data['mt'], $data['date'], $data['idcom'], $data['tel'], $data['idliv'], $data['idcom'])) {
        $id = $data['id'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $localisation = $data['localisation'];
        $idvend = $data['idvend'];
        $idcom = $data['idcom'];
        $userid = $data['userid'];
        $mt = $data['mt'];
        $dat = $data['date'];
        $idclient=$data['idclient'];
         $tel=$data['tel'];
         $idliv=$data['idliv'];
        $sql = $pdo->prepare('INSERT INTO bonlivraison (id_commande, id_operateur, id_livreur, id_commerciale, id_vendeur, id_client, nom_client, prenom_client,montant_totale,localisation,date_livraison,telephone_client) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)');
        $sql->execute([$id, $userid, $idliv, $idcom, $idvend, $idclient, $nom, $prenom,$mt,$localisation,$dat,$tel]);
        
        echo json_encode(array('message' => 'Data inserted successfully'));
    } else {
        echo json_encode(array('error' => 'Required data is missing.'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
