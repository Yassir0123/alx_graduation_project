<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['idcmd'],$data['mt'], $data['date'])) {
        $idcmd = $data['idcmd'];
        $mt = $data['mt'];
        $dat = $data['date'];

        $sql = $pdo->prepare('UPDATE commande set montant_totale = ?, date_livraison = ? where id_commande = ?');
        $sql->execute([ $mt, $dat, $idcmd]);
        echo json_encode(array('message' => 'Data inserted successfully'));
    } else {
        echo json_encode(array('error' => 'Required data is missing.'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
