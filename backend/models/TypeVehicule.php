<?php
class TypeVehicule {
    private $conn;
    private $table_name = "type_vehicule";

    public $idtype;
    public $type;
    public $icone;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET type=:type, icone=:icone";

        $stmt = $this->conn->prepare($query);

        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->icone = htmlspecialchars(strip_tags($this->icone));

        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":icone", $this->icone);

        if($stmt->execute()) {
            $this->idtype = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY type ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function getById() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE idtype = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idtype);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->type = $row['type'];
            $this->icone = $row['icone'];
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                 SET type=:type, icone=:icone 
                 WHERE idtype=:idtype";

        $stmt = $this->conn->prepare($query);

        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->icone = htmlspecialchars(strip_tags($this->icone));
        $this->idtype = htmlspecialchars(strip_tags($this->idtype));

        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":icone", $this->icone);
        $stmt->bindParam(":idtype", $this->idtype);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE idtype = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idtype);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
