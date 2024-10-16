<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read the raw POST data as JSON
    $data = json_decode(file_get_contents("php://input"), true);
    echo "Received Data: " . json_encode($data) . "\n";
    // Check if the required data fields are set
    if (isset($data['email'], $data['nom'], $data['categorie'],$data['telephone'], $data['ville'], $data['adresse'], $data['pays'], $data['date'],$data['codeposte'])) {
        $email = $data['email'];
        $code = $data['codeposte'];
        $ville = $data['ville'];
        $adresse = $data['adresse'];
        $nom = $data['nom'];
        $pays = $data['pays'];
        $telephone=$data['telephone'];
        $date = $data['date'];
        $categorie=$data['categorie'];
        $sql = $pdo->prepare('INSERT INTO fournisseur(nom_entreprise,email_contact,telephone_contact,categorie_produit,adresse,ville,pays,code_postal,date_creation) VALUES(?,?,?,?,?,?,?,?,?)');
        $sql->execute([$nom, $email, $telephone, $categorie, $adresse, $ville, $pays, $code,$date]);
        
    
    } else {

        echo json_encode(array('error' => 'Missing required fields'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>

