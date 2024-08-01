<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    $sql = $pdo->prepare('SELECT * FROM fournisseur');
 
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
   
    if (count($response) > 0) {
        $sqll = $pdo->prepare('SELECT COUNT(id_commandeachat) as id_commandeachat from commandesachat');
        $sqll->execute();
        $tab = $sqll->fetchAll(PDO::FETCH_ASSOC);
        $action=0;
        if ($tab[0]['id_commandeachat'] > 0) {

           
            // Get the count value
            $sqllr = $pdo->prepare('SELECT MAX(id_commandeachat) from commandesachat');
            $sqllr->execute();
            $ta = $sqllr->fetchAll(PDO::FETCH_ASSOC);
            $countValu = reset($ta);
            $countValue=reset($countValu);
            // Iterate through each row in $response and add the count as a new column
            foreach ($response as &$row) {
                $row['idcmdcount'] = $countValue+1;
                $row['action']=$action;
              
            }
          

           // echo json_encode(array('message' => 'got data', 'userData' => $response));
        } else {
              $idv=$tab[0]['id_commandeachat'];
              foreach ($response as &$row) {
                $row['idcmdcount'] = $idv+1;
                $row['action']=$action;
              
            }
        
           //   echo json_encode(array('message' => 'no data retrieved'));
        }
        echo json_encode(array('message' => 'got data', 'userData' => $response));
    } else {
      
       
        echo json_encode(array('message' => 'no data retrieved'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>