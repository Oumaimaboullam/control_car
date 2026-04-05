<?php
class User {
    private $conn;
    private $table_name = "users";

    public $iduser;
    public $nom;
    public $prenom;
    public $adresse;
    public $ville;
    public $email;
    public $telephone;
    public $password;
    public $photo;
    public $role;
    public $is_active;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET nom=:nom, prenom=:prenom, adresse=:adresse, ville=:ville, 
                     email=:email, telephone=:telephone, password=:password, role=:role";

        $stmt = $this->conn->prepare($query);

        $this->nom = htmlspecialchars(strip_tags($this->nom));
        $this->prenom = htmlspecialchars(strip_tags($this->prenom));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        $this->ville = htmlspecialchars(strip_tags($this->ville));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->telephone = htmlspecialchars(strip_tags($this->telephone));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        $this->role = htmlspecialchars(strip_tags($this->role));

        $stmt->bindParam(":nom", $this->nom);
        $stmt->bindParam(":prenom", $this->prenom);
        $stmt->bindParam(":adresse", $this->adresse);
        $stmt->bindParam(":ville", $this->ville);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":telephone", $this->telephone);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":role", $this->role);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function login() {
        $query = "SELECT iduser, nom, prenom, email, telephone, password, role, is_active 
                 FROM " . $this->table_name . " 
                 WHERE email = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row && password_verify($this->password, $row['password']) && $row['is_active'] == 1) {
            $this->iduser = $row['iduser'];
            $this->nom = $row['nom'];
            $this->prenom = $row['prenom'];
            $this->telephone = $row['telephone'];
            $this->role = $row['role'];
            return true;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT iduser, nom, prenom, email, telephone, role, is_active, create_at 
                 FROM " . $this->table_name . " 
                 ORDER BY create_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function getById() {
        $query = "SELECT iduser, nom, prenom, adresse, ville, email, telephone, photo, role, is_active 
                 FROM " . $this->table_name . " 
                 WHERE iduser = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->iduser);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->nom = $row['nom'];
            $this->prenom = $row['prenom'];
            $this->adresse = $row['adresse'];
            $this->ville = $row['ville'];
            $this->email = $row['email'];
            $this->telephone = $row['telephone'];
            $this->photo = $row['photo'];
            $this->role = $row['role'];
            $this->is_active = $row['is_active'];
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                 SET nom=:nom, prenom=:prenom, adresse=:adresse, ville=:ville, 
                     email=:email, telephone=:telephone";

        if(!empty($this->password)) {
            $query .= ", password=:password";
        }

        $query .= " WHERE iduser=:iduser";

        $stmt = $this->conn->prepare($query);

        $this->nom = htmlspecialchars(strip_tags($this->nom));
        $this->prenom = htmlspecialchars(strip_tags($this->prenom));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        $this->ville = htmlspecialchars(strip_tags($this->ville));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->telephone = htmlspecialchars(strip_tags($this->telephone));

        $stmt->bindParam(":nom", $this->nom);
        $stmt->bindParam(":prenom", $this->prenom);
        $stmt->bindParam(":adresse", $this->adresse);
        $stmt->bindParam(":ville", $this->ville);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":telephone", $this->telephone);
        $stmt->bindParam(":iduser", $this->iduser);

        if(!empty($this->password)) {
            $this->password = password_hash($this->password, PASSWORD_DEFAULT);
            $stmt->bindParam(":password", $this->password);
        }

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function toggleActive() {
        $query = "UPDATE " . $this->table_name . " 
                 SET is_active = NOT is_active 
                 WHERE iduser = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->iduser);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function emailExists() {
        $query = "SELECT iduser FROM " . $this->table_name . " WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function telephoneExists() {
        $query = "SELECT iduser FROM " . $this->table_name . " WHERE telephone = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->telephone);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
}
?>
