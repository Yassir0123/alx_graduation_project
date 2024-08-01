<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['nom'], $data['prenom'], $data['localisation'], $data['email'], $data['userid'], $data['mt'], $data['date'])) {
        $idclient = $data['id'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $localisation = $data['localisation'];
        $email = $data['email'];
        $userid = $data['userid'];
        $mt = $data['mt'];
        $dat = $data['date'];
        $emailParts = explode('@', $email);
        $domain = strtolower($emailParts[1]);
        $id_vend = 0;
        $id_com = 0;

        if ($domain == "vendeur.com") {
            $id_vend = $userid;
            $a = $pdo->prepare('SELECT id_commerciale from vendeur where id_vendeur=?');
            $a->execute([$userid]);
            $tab = $a->fetchAll(PDO::FETCH_ASSOC);
            $b = reset($tab);
            $c = reset($b);
            $id_com = $c;

        } else {
            $id_com = $userid;
            $id_vend = null;
        }

        $sql = $pdo->prepare('INSERT INTO commande (id_vendeur, id_commerciale, id_client, montant_totale, date_livraison, localisation, nom_client, prenom_client) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$id_vend, $id_com, $idclient, $mt, $dat, $localisation, $nom, $prenom]);
        
        echo json_encode(array('message' => 'Data inserted successfully'));
    } else {
        echo json_encode(array('error' => 'Required data is missing.'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
