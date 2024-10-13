<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['userid'];
    $email= $data['email'];
    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    if ($domain == "vendeur.com")
    {
        //total cmd valider
        $sql = $pdo->prepare('SELECT COUNT(id_vendeur) as id_vendeur from commande2 WHERE id_vendeur=?');
        $sql->execute([$id]);
        $cmdvalider = $sql->fetchAll(PDO::FETCH_ASSOC);
        //total MT valider
        $sql = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale from bonvalider WHERE id_vendeur=?');
        $sql->execute([$id]);
        $mtvalider = $sql->fetchAll(PDO::FETCH_ASSOC);
        $mtvalider['montant_totale'] = number_format($mtvalider['montant_totale'], 2, ',', ' ');
        //Total Products sold
        $sql = $pdo->prepare('SELECT id_commande from  commande WHERE id_vendeur=?');
        $sql->execute([$id]);
        $cmd = $sql->fetchAll(PDO::FETCH_ASSOC);
        $total = [];
        foreach($cmd as $row)
        {
            $getid = $row['id_commande'];
            $sql = $pdo->prepare('SELECT COUNT(id_lignecommande) as total from  lignecommande WHERE id_lignecommande=?');
            $sql->execute([$getid]);
            $cmdnew = $sql->fetchAll(PDO::FETCH_ASSOC);
            $newtotal = $cmdnew['total'];
            $total[] = $newtotal;

        }
        $totalmontant = 0;
        foreach($total as $row)
        {
            $totalmontant=$totalmontant+$total;
        }
        //totalMT per date
        $sql = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale, date_livraison as date_commande from commande WHERE id_vendeur=? GROUP BY date_livraison');
        $sql->execute([$id]);
        $totalmtdate = $sql->fetchAll(PDO::FETCH_ASSOC);
        $totalmtdate['montant_totale'] = number_format($totalmtdate['montant_totale'], 2, ',', ' ');
        //totalcmd per date
        $sql = $pdo->prepare('SELECT COUNT(id_commande) as commandes, date_livraison as date_commande from commande WHERE id_vendeur=? GROUP BY date_livraison');
        $sql->execute([$id]);
        $totalmtdate = $sql->fetchAll(PDO::FETCH_ASSOC);
    }
    else
    {
                //total cmd valider
                $sql = $pdo->prepare('SELECT COUNT(id_vendeur) as id_vendeur from commande2 WHERE id_commerciale=?');
                $sql->execute([$id]);
                $cmdvalider = $sql->fetchAll(PDO::FETCH_ASSOC);
                //total MT valider
                $sql = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale from bonvalider WHERE id_commerciale=?');
                $sql->execute([$id]);
                $mtvalider = $sql->fetchAll(PDO::FETCH_ASSOC);
                $mtvalider['montant_totale'] = number_format($mtvalider['montant_totale'], 2, ',', ' ');
                //Total Products sold
                $sql = $pdo->prepare('SELECT id_commande from  commande WHERE id_commerciale=?');
                $sql->execute([$id]);
                $cmd = $sql->fetchAll(PDO::FETCH_ASSOC);
                $total = [];
                foreach($cmd as $row)
                {
                    $getid = $row['id_commande'];
                    $sql = $pdo->prepare('SELECT COUNT(id_lignecommande) as total from  lignecommande WHERE lignecommande=?');
                    $sql->execute([$getid]);
                    $cmdnew = $sql->fetchAll(PDO::FETCH_ASSOC);
                    $newtotal = $cmdnew['total'];
                    $total[] = $newtotal;
        
                }
                $totalmontant = 0;
                foreach($total as $row)
                {
                    $totalmontant=$totalmontant+$total;
                }
                //totalMT per date
                $sql = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale, date_livraison as date_commande from commande WHERE id_commerciale=? GROUP BY date_livraison');
                $sql->execute([$id]);
                $totalmtdate = $sql->fetchAll(PDO::FETCH_ASSOC);
                $totalmtdate['montant_totale'] = number_format($totalmtdate['montant_totale'], 2, ',', ' ');
                //totalcmd per date
                $sql = $pdo->prepare('SELECT COUNT(id_commande) as commandes, date_livraison as date_commande from commande WHERE id_commerciale=? GROUP BY date_livraison');
                $sql->execute([$id]);
                $totalcmddate = $sql->fetchAll(PDO::FETCH_ASSOC);
                //sending
                // Send the response as JSON
        echo json_encode(array(
            'message' => 'Data retrieved successfully',
            'totalProductsSold' => $totalmontant,
            'totalCommandsValidated' => $cmdvalider['id_vendeur'],
            'totalAmountValidated' => $mtvalider['montant_totale'],
            'totalmtdate' => $totalmtdate,
            'totalcmddate' => $totalcmddate
        ));
            }
    
}catch(PDOException $e){
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}