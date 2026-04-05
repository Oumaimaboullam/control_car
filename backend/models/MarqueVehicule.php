<?php
class MarqueVehicule {
    private $conn;
    private $table_name = "marque_vehicule";

    public $idmarque;
    public $idtype;
    public $marque;
    public $icone;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET idtype=:idtype, marque=:marque, icone=:icone";

        $stmt = $this->conn->prepare($query);

        $this->idtype = htmlspecialchars(strip_tags($this->idtype));
        $this->marque = htmlspecialchars(strip_tags($this->marque));
        $this->icone = htmlspecialchars(strip_tags($this->icone));

        $stmt->bindParam(":idtype", $this->idtype);
        $stmt->bindParam(":marque", $this->marque);
        $stmt->bindParam(":icone", $this->icone);

        if($stmt->execute()) {
            $this->idmarque = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT m.*, t.type 
                 FROM " . $this->table_name . " m
                 LEFT JOIN type_vehicule t ON m.idtype = t.idtype
                 ORDER BY t.type ASC, m.marque ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function getById() {
        $query = "SELECT m.*, t.type 
                 FROM " . $this->table_name . " m
                 LEFT JOIN type_vehicule t ON m.idtype = t.idtype
                 WHERE m.idmarque = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idmarque);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->idtype = $row['idtype'];
            $this->marque = $row['marque'];
            $this->icone = $row['icone'];
            return $row;
        }
        return false;
    }

    public function getByType() {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE idtype = ? ORDER BY marque ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idtype);
        $stmt->execute();

        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                 SET idtype=:idtype, marque=:marque, icone=:icone 
                 WHERE idmarque=:idmarque";

        $stmt = $this->conn->prepare($query);

        $this->idtype = htmlspecialchars(strip_tags($this->idtype));
        $this->marque = htmlspecialchars(strip_tags($this->marque));
        $this->icone = htmlspecialchars(strip_tags($this->icone));
        $this->idmarque = htmlspecialchars(strip_tags($this->idmarque));

        $stmt->bindParam(":idtype", $this->idtype);
        $stmt->bindParam(":marque", $this->marque);
        $stmt->bindParam(":icone", $this->icone);
        $stmt->bindParam(":idmarque", $this->idmarque);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE idmarque = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idmarque);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
