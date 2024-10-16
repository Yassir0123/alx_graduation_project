<?php

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    $pass = $data['password'];

    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    
    if ($domain == "vendeur.com") {
        $sql = $pdo->prepare('SELECT id_vendeur AS id, nom, prenom FROM vendeur WHERE email=? and password= ?');
    } elseif ($domain == "commerciale.com") {
        $sql = $pdo->prepare('SELECT id_commerciale AS id, nom, prenom FROM commerciale WHERE email=? and password= ?');
    } elseif ($domain == "livreur.com") {
        $sql = $pdo->prepare('SELECT id_livreur AS id, nom, prenom FROM livreur WHERE email=? and password= ?');
    } elseif ($domain == "comptable.com") {
        $sql = $pdo->prepare('SELECT id_comptable AS id, nom, prenom FROM comptable WHERE email=? and password= ?');
    } elseif ($domain == "receptionist.com") {
        $sql = $pdo->prepare('SELECT id_receptionniste AS id, nom, prenom FROM receptionniste WHERE email=? and password= ?');
    } elseif ($domain == "operateur.com") {
        $sql = $pdo->prepare('SELECT id_operateur AS id, nom, prenom FROM operateur WHERE email=? and password= ?');
    } elseif ($domain == "achat.com") {
        $sql = $pdo->prepare('SELECT id_achat AS id, nom, prenom FROM achat WHERE email=? and password= ?');
    } else {
        echo json_encode(array('error' => 'Invalid email domain or interface'));
        exit;
    }

    $sql->execute([$email, $pass]);
    $response = $sql->fetch(PDO::FETCH_ASSOC); // Use fetch instead of fetchAll to get just one row
    if ($response) {
        echo json_encode(array('message' => 'Login successful', 'id' => $response['id'], 'nom' => $response['nom'], 'prenom' => $response['prenom']));
    } else {
        echo json_encode(array('error' => 'Invalid login credential'));
    }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}

















/*header("Content-Type: application/json");//we need to translate the php data to json, to be accepted and read, aswell as intepreted by react, so we use this
echo json_encode($tab);//we send the data to the react page in its json format, for the array, we'll switch it from a php array to react array*/

 /*catch (PDOException $e) {
    // Return an error message if something goes wrong
    echo "Error: " . $e->getMessage();
    */

?>