<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['nom'], $data['categorie'], $data['telephone'], $data['email'], $data['userid'], $data['mt'], $data['date'],$data['idcmd'])) {
        $id = $data['idcmd'];
        $nom = $data['nom'];
        $idfour = $data['id'];
        $userid = $data['userid'];
        $cat = $data['categorie'];
        $tel = $data['telephone'];
        $email = $data['email'];
        $mt = $data['mt'];
        $dat = $data['date'];

      
        


        $sql = $pdo->prepare('INSERT INTO commandesachat (id_commandeachat, id_achat, id_fournisseur,nom_entreprise,email,telephone,categorie,montant_totale, date_livraison) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $sql->execute([$id,$userid,$idfour,$nom,$email,$tel,$cat,$mt,$dat]);
        
        echo json_encode(array('message' => 'Data inserted successfully'));
    } else {
        echo json_encode(array('error' => 'Required data is missing.'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
