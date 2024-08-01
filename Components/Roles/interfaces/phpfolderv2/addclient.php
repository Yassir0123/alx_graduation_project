<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read the raw POST data as JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the required data fields are set
    if (isset($data['email'], $data['userId'], $data['localisation'],$data['cin'], $data['adresse'], $data['nom'], $data['prenom'], $data['date'])) {
        $email = $data['email'];
        $id = $data['userId'];
        $cin = $data['cin'];
        $adresse = $data['adresse'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $localisation=$data['localisation'];
        $date = $data['date'];
        $emailParts = explode('@', $email);
        $domain = isset($emailParts[1]) ? strtolower($emailParts[1]) : '';

        if ($domain == "vendeur.com") {
           $id_vend=$id;
           $id_com=null;
        } else {
          $id_com=$id;
          $id_vend=null;
        }
        $sql = $pdo->prepare('INSERT INTO client(cin, nom, prenom, addresse, localisation, id_vendeur, id_commerciale, date_naissance) VALUES(?,?,?,?,?,?,?,?)');
        $sql->execute([$cin, $nom, $prenom, $adresse, $localisation, $id_vend, $id_com, $date]);

        //1
        $sqle=$pdo->prepare('SELECT id_client, nom, prenom,localisation
        FROM client
        WHERE id_client = (SELECT MAX(id_client) FROM client)
        ');
        $sqle->execute();
        $response=$sqle->fetchAll(PDO::FETCH_ASSOC);
        //2
       if(count($response)>0) {
        $sqll = $pdo->prepare('SELECT COUNT(id_commande) as id_commande from commande');
        $sqll->execute();
        $tab = $sqll->fetchAll(PDO::FETCH_ASSOC);

        if ($tab[0]['id_commande'] > 0) {

            $action=0;
            // Get the count value
            $sqllr = $pdo->prepare('SELECT MAX(id_commande) from commande');
            $sqllr->execute();
            $ta = $sqllr->fetchAll(PDO::FETCH_ASSOC);
            $countValu = reset($ta);
            $countValue=reset($countValu);
            // Iterate through each row in $response and add the count as a new column
            $response[0]['idcmdcount']=$countValue+1;
            $response[0]['actions']=0;
            echo json_encode(array('message' => 'got data', 'userData' => $response));
        } else {
            echo json_encode(array('message' => 'no data retrieved for tab'));
        }}
        else{
            echo json_encode(array('message' => 'no data retrieved for response'));
        }

    } else {

        echo json_encode(array('error' => 'Missing required fields'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
