<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    $cat=$data['nomcat'];
    $image=$data['image'];
    $idligne=$data['id_grandcategorie'];
   $sql=$pdo->prepare('INSERT INTO categorie(nom_categorie,image,id_grandcategorie) VALUES(?,?,?)');
   $sql->execute([$cat,$image,$idligne]);
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
