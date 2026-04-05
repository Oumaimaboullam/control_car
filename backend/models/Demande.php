<?php
class Demande {
    private $conn;
    private $table_name = "demande";

    public $id_demande;
    public $iduser;
    public $matricule;
    public $adresse;
    public $telephone;
    public $time;
    public $date;
    public $status;
    public $lien;
    public $idmarque;
    public $idtype;
    public $number;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET iduser=:iduser, matricule=:matricule, adresse=:adresse, 
                     telephone=:telephone, time=:time, date=:date, status=:status, 
                     lien=:lien, idmarque=:idmarque, idtype=:idtype, number=:number";

        $stmt = $this->conn->prepare($query);

        $this->iduser = htmlspecialchars(strip_tags($this->iduser));
        $this->matricule = htmlspecialchars(strip_tags($this->matricule));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        $this->telephone = htmlspecialchars(strip_tags($this->telephone));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->lien = htmlspecialchars(strip_tags($this->lien));
        $this->idmarque = htmlspecialchars(strip_tags($this->idmarque));
        $this->idtype = htmlspecialchars(strip_tags($this->idtype));
        $this->number = htmlspecialchars(strip_tags($this->number));

        $stmt->bindParam(":iduser", $this->iduser);
        $stmt->bindParam(":matricule", $this->matricule);
        $stmt->bindParam(":adresse", $this->adresse);
        $stmt->bindParam(":telephone", $this->telephone);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":lien", $this->lien);
        $stmt->bindParam(":idmarque", $this->idmarque);
        $stmt->bindParam(":idtype", $this->idtype);
        $stmt->bindParam(":number", $this->number);

        if($stmt->execute()) {
            $this->id_demande = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT d.*, u.nom, u.prenom, u.email, m.marque, t.type 
                 FROM " . $this->table_name . " d
                 LEFT JOIN users u ON d.iduser = u.iduser
                 LEFT JOIN marque_vehicule m ON d.idmarque = m.idmarque
                 LEFT JOIN type_vehicule t ON d.idtype = t.idtype
                 ORDER BY d.create_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function getByUserId() {
        $query = "SELECT d.*, m.marque, t.type 
                 FROM " . $this->table_name . " d
                 LEFT JOIN marque_vehicule m ON d.idmarque = m.idmarque
                 LEFT JOIN type_vehicule t ON d.idtype = t.idtype
                 WHERE d.iduser = ? 
                 ORDER BY d.create_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->iduser);
        $stmt->execute();

        return $stmt;
    }

    public function getById() {
        $query = "SELECT d.*, u.nom, u.prenom, u.email, m.marque, t.type 
                 FROM " . $this->table_name . " d
                 LEFT JOIN users u ON d.iduser = u.iduser
                 LEFT JOIN marque_vehicule m ON d.idmarque = m.idmarque
                 LEFT JOIN type_vehicule t ON d.idtype = t.idtype
                 WHERE d.id_demande = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id_demande);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->iduser = $row['iduser'];
            $this->matricule = $row['matricule'];
            $this->adresse = $row['adresse'];
            $this->telephone = $row['telephone'];
            $this->time = $row['time'];
            $this->date = $row['date'];
            $this->status = $row['status'];
            $this->lien = $row['lien'];
            $this->idmarque = $row['idmarque'];
            $this->idtype = $row['idtype'];
            $this->number = $row['number'];
            return $row;
        }
        return false;
    }

    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " 
                 SET status = :status 
                 WHERE id_demande = :id_demande";

        $stmt = $this->conn->prepare($query);

        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id_demande = htmlspecialchars(strip_tags($this->id_demande));

        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id_demande", $this->id_demande);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getByStatus() {
        $query = "SELECT d.*, u.nom, u.prenom, u.email, m.marque, t.type 
                 FROM " . $this->table_name . " d
                 LEFT JOIN users u ON d.iduser = u.iduser
                 LEFT JOIN marque_vehicule m ON d.idmarque = m.idmarque
                 LEFT JOIN type_vehicule t ON d.idtype = t.idtype
                 WHERE d.status = ? 
                 ORDER BY d.create_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->status);
        $stmt->execute();

        return $stmt;
    }
}
?>
