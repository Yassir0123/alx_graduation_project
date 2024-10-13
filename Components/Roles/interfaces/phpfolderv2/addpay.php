<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if the required variables are set in the JSON data
    if (
        isset($data['idbon'], $data['idclt'], $data['idliv'], $data['mp'], $data['tel'], $data['moy'],
        $data['mt'], $data['dat'], $data['nom'], $data['prenom'])
    ) {
        // Extract data from the JSON
        $idbon = $data['idbon'];
        $idclt = $data['idclt'];
        $idliv = $data['idliv'];
        $mp = $data['mp'];
        $tel = $data['tel'];
        $my = $data['moy'];
        $mt = $data['mt'];
        $idc = $data['idc'];
        $idv = $data['idv'];
        $cm= $data['cm'];
        $op = $data['op'];
        $dat = $data['dat'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $localisation = $data['loc'];

        // Prepare and execute the SQL query
        $sql = $pdo->prepare('INSERT INTO paiement (id_bonlivraison, id_livreur, montant_totale, montant_payer, moyen_paiement, id_client, nom_client, prenom_client, date_paiement, telephone_client) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$idbon, $idliv, $mt, $mp, $my, $idclt, $nom, $prenom, $dat, $tel]);
        $sql2 = $pdo->prepare('INSERT INTO bonvalider (id_bonlivraison,id_commande, id_operateur, id_livreur, id_commerciale, id_vendeur, id_client, nom_client, prenom_client,localisation,date_livraison,telephone_client,montant_totale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)');
        $sql2->execute([$idbon, $cm, $op, $idliv, $idc,$idv, $idclt, $nom, $prenom,$localisation,$dat,$tel,$mt]);
        echo json_encode(array('message' => 'Data inserted successfully'));
    } else {
        echo json_encode(array('error' => 'Required data is missing'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
