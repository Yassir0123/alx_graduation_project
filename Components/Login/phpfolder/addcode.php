<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    $pass = $data['code'];
    $id=$data['id'];
    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    
    if ($domain == "vendeur.com" || $domain=="gmail.com") {
        $sql = $pdo->prepare('UPDATE vendeur SET code = ? WHERE id_vendeur = ?');
        
    } elseif ($domain == "commerciale.com") {
        $sql = $pdo->prepare('UPDATE commerciale SET code = ? WHERE id_commerciale = ?');
  
    } elseif ($domain == "livreur.com") {
        $sql = $pdo->prepare('UPDATE livreur SET code = ? WHERE id_livreur = ?');
   
    } elseif ($domain == "comptable.com") {
        $sql = $pdo->prepare('UPDATE comptable SET code = ? WHERE id_comptable = ?');
        
    } elseif ($domain == "receptionniste.com") {
        $sql = $pdo->prepare('UPDATE receptionniste SET code = ? WHERE id_receptionniste = ?');
       
    } elseif ($domain == "operateur.com") {
        $sql = $pdo->prepare('UPDATE operateur SET code = ? WHERE id_operateur = ?');
  
    }
 elseif ($domain == "achat.com") {
    $sql = $pdo->prepare('UPDATE achat SET code = ? WHERE id_achat = ?');

}
     else {
        echo json_encode(array('error' => 'Invalid email domain or interface'));
        exit;
    }
    $sql->execute([$pass, $id]);

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
