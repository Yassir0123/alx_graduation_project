<?php

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    

    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    if ($domain == "vendeur.com"|| $domain=="gmail.com") {
        $sql = $pdo->prepare('SELECT id_vendeur FROM vendeur WHERE email=? ');
    } elseif ($domain == "commerciale.com") {
        $sql = $pdo->prepare('SELECT id_commerciale FROM commerciale WHERE email=? ');
    } elseif ($domain == "livreur.com") {
        $sql = $pdo->prepare('SELECT id_livreur FROM livreur WHERE email=? ');
    } elseif ($domain == "comptable.com") {
        $sql = $pdo->prepare('SELECT id_comptable FROM comptable WHERE email=? ');
    } elseif ($domain == "receptionniste.com") {
        $sql = $pdo->prepare('SELECT id_receptionniste FROM receptionniste WHERE email=?');
    } elseif ($domain == "operateur.com") {
        $sql = $pdo->prepare('SELECT id_operateur FROM operateur WHERE email=? ');
    } 
    elseif ($domain == "achat.com") {
        $sql = $pdo->prepare('SELECT id_achat FROM achat WHERE email=?');
    
    }
    else {
        echo json_encode(array('error' => 'Invalid email domain or interface'));
        exit;
    }

    $sql->execute([$email]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    if (count($response) > 0) {
        $id = reset($response); // Get the first element of the array
        $idValue = reset($id); // Get the value of the id
        echo json_encode(array('message' => 'Login successful', 'userData' => $idValue));
    } else {
        echo json_encode(array('error' => 'Invalid login credential'));
    }

    // For now, just sending a success response
    

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