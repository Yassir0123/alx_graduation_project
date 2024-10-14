<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $userid= $data['userid'];
    $sql = $pdo->prepare('UPDATE commandesachat SET status = 1, seeable = 1 WHERE id_commandeachat = ?');
    $sql->execute([$userid]);
    echo json_encode(array('message' => 'Data updated'));
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
