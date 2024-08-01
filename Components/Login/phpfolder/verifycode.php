<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    $pass = $data['code'];

    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    if ($domain == "vendeur.com"|| $domain=="gmail.com") {
        $sql = $pdo->prepare('SELECT code FROM vendeur WHERE email=?');
    } elseif ($domain == "commerciale.com") {
        $sql = $pdo->prepare('SELECT code FROM commerciale WHERE email=? ');
    } elseif ($domain == "livreur.com") {
        $sql = $pdo->prepare('SELECT code FROM livreur WHERE email=? ');
    } elseif ($domain == "comptable.com") {
        $sql = $pdo->prepare('SELECT code FROM comptable WHERE email=? ');
    } elseif ($domain == "receptionist.com") {
        $sql = $pdo->prepare('SELECT code FROM receptionniste WHERE email=? ');
    } elseif ($domain == "operateur.com") {
        $sql = $pdo->prepare('SELECT code FROM operateur WHERE email=?');
    }
    elseif ($domain == "achat.com") {
        $sql = $pdo->prepare('SELECT code FROM achat WHERE email=?');
    }
    else {
        echo json_encode(array('error' => 'Invalid email domain or interface'));
        exit;
    }

    $sql->execute([$email]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    if (count($response) > 0) {
        $id = reset($response); // Get the first element of the array
        $idValue = reset($id);
       
        if ($idValue == $pass) {
            echo json_encode(array('message' => 'Login successful'));
        } else {
            echo json_encode(array('message' => 'nodata'));
        }
    } else {
        echo json_encode(array('error' => 'Invalid login credential'));
    }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
