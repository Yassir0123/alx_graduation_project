<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read the raw POST data as JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the required data fields are set
    if (isset($data['email'], $data['userId'], $data['zone'],$data['cin'], $data['adresse'], $data['nom'], $data['prenom'], $data['date'],$data['password'])) {
        $email = $data['email'];
        $id = $data['userId'];
        $cin = $data['cin'];
        $adresse = $data['adresse'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $zone=$data['zone'];
        $date = $data['date'];
        $pass=$data['password'];
        $sql = $pdo->prepare('INSERT INTO vendeur(nom,prenom,cin,date_naissance,zone,addresse,id_commerciale,email,password) VALUES(?,?,?,?,?,?,?,?,?)');
        $sql->execute([$nom, $prenom, $cin, $date, $zone, $adresse, $id, $email,$pass]);
        
    
    } else {

        echo json_encode(array('error' => 'Missing required fields'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>


