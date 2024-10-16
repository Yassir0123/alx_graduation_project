<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    
    $idligne = $data['id'];
  

    // Check if idcmd is provided and not null
    if ($idligne !== null) {
        $sql = $pdo->prepare('DELETE FROM bonlivraison where id_bonlivraison=?');
        $sql->execute([$idligne]);
        
        // Return a success message or the newly inserted ID if needed
        echo json_encode(array('message' => 'Data deleted successfully'));
    } else {
        echo json_encode(array('error' => 'idligne is missing or null'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>

