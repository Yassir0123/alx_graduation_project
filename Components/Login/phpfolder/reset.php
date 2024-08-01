<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['userEmail'];
    $newPassword = $data['newPassword'];
    $id=$data['userId'];
    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);

    $sql = null;
    $idField = null;

    if ($domain == "vendeur.com" ||$domain=="gmail.com") {
        $sql = $pdo->prepare('UPDATE vendeur SET password = ? WHERE id_vendeur = ?');
        
    } elseif ($domain == "commerciale.com") {
        $sql = $pdo->prepare('UPDATE commerciale SET password = ? WHERE id_commerciale = ?');
  
    } elseif ($domain == "livreur.com") {
        $sql = $pdo->prepare('UPDATE livreur SET password = ? WHERE id_livreur = ?');
   
    } elseif ($domain == "comptable.com") {
        $sql = $pdo->prepare('UPDATE comptable SET password = ? WHERE id_comptable = ?');
        
    } elseif ($domain == "receptionniste.com") {
        $sql = $pdo->prepare('UPDATE receptionniste SET password = ? WHERE id_receptionniste = ?');
       
    } elseif ($domain == "operateur.com") {
        $sql = $pdo->prepare('UPDATE operateur SET password = ? WHERE id_operateur = ?');
  
    } 
    elseif ($domain == "achat.com") {
        $sql = $pdo->prepare('UPDATE achat SET password = ? WHERE id_achat = ?');
  
    } 
    else {
        echo json_encode(array('error' => 'Invalid email domain or interface'));
        exit;
    }

    $sql->execute([$newPassword, $id]);
    echo json_encode(array('message' => 'welldone'));
}

catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
