<?php
class Facture {
    private $conn;
    private $table_name = "facture";

    public $idfacture;
    public $prix;
    public $id_demande;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET prix=:prix, id_demande=:id_demande";

        $stmt = $this->conn->prepare($query);

        $this->prix = htmlspecialchars(strip_tags($this->prix));
        $this->id_demande = htmlspecialchars(strip_tags($this->id_demande));

        $stmt->bindParam(":prix", $this->prix);
        $stmt->bindParam(":id_demande", $this->id_demande);

        if($stmt->execute()) {
            $this->idfacture = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getById() {
        $query = "SELECT f.*, d.matricule, d.date, d.number, u.nom, u.prenom 
                 FROM " . $this->table_name . " f
                 LEFT JOIN demande d ON f.id_demande = d.id_demande
                 LEFT JOIN users u ON d.iduser = u.iduser
                 WHERE f.idfacture = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idfacture);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->prix = $row['prix'];
            $this->id_demande = $row['id_demande'];
            return $row;
        }
        return false;
    }

    public function getByDemandeId() {
        $query = "SELECT f.*, d.matricule, d.date, d.number, u.nom, u.prenom 
                 FROM " . $this->table_name . " f
                 LEFT JOIN demande d ON f.id_demande = d.id_demande
                 LEFT JOIN users u ON d.iduser = u.iduser
                 WHERE f.id_demande = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id_demande);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->idfacture = $row['idfacture'];
            $this->prix = $row['prix'];
            return $row;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT f.*, d.matricule, d.date, d.number, u.nom, u.prenom 
                 FROM " . $this->table_name . " f
                 LEFT JOIN demande d ON f.id_demande = d.id_demande
                 LEFT JOIN users u ON d.iduser = u.iduser
                 ORDER BY f.idfacture DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>
