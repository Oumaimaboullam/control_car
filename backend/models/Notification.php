<?php
class Notification {
    private $conn;
    private $table_name = "notification";

    public $id_notif;
    public $text;
    public $date;
    public $is_read;
    public $iduser;
    public $id_demande;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET text=:text, date=:date, is_read=:is_read, iduser=:iduser, id_demande=:id_demande";

        $stmt = $this->conn->prepare($query);

        $this->text = htmlspecialchars(strip_tags($this->text));
        $this->date = date('Y-m-d H:i:s');
        $this->is_read = 0;
        $this->iduser = htmlspecialchars(strip_tags($this->iduser));
        $this->id_demande = htmlspecialchars(strip_tags($this->id_demande));

        $stmt->bindParam(":text", $this->text);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":is_read", $this->is_read);
        $stmt->bindParam(":iduser", $this->iduser);
        $stmt->bindParam(":id_demande", $this->id_demande);

        if($stmt->execute()) {
            $this->id_notif = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getByUserId() {
        $query = "SELECT n.*, d.matricule, d.status 
                 FROM " . $this->table_name . " n
                 LEFT JOIN demande d ON n.id_demande = d.id_demande
                 WHERE n.iduser = ? 
                 ORDER BY n.date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->iduser);
        $stmt->execute();

        return $stmt;
    }

    public function getUnreadByUserId() {
        $query = "SELECT COUNT(*) as unread_count 
                 FROM " . $this->table_name . " 
                 WHERE iduser = ? AND is_read = 0";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->iduser);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['unread_count'];
    }

    public function markAsRead() {
        $query = "UPDATE " . $this->table_name . " 
                 SET is_read = 1 
                 WHERE id_notif = ? AND iduser = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id_notif);
        $stmt->bindParam(2, $this->iduser);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function markAllAsRead() {
        $query = "UPDATE " . $this->table_name . " 
                 SET is_read = 1 
                 WHERE iduser = ? AND is_read = 0";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->iduser);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
