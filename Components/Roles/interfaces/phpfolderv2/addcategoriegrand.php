<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $cat=$data['nomcat'];
    $image=$data['image'];

   $sql=$pdo->prepare('INSERT INTO grandcategorie(nom_categorie,image) VALUES(?,?)');
   $sql->execute([$cat,$image]);
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>

