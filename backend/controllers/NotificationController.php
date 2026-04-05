<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Notification.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class NotificationController {
    private $db;
    private $notification;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->notification = new Notification($this->db);
    }

    public function getByUser() {
        $current_user_id = AuthMiddleware::getCurrentUserId();
        
        if (!$current_user_id) {
            http_response_code(401);
            echo json_encode(array("message" => "Utilisateur non connecté"));
            return;
        }
        
        $this->notification->iduser = $current_user_id;
        $stmt = $this->notification->getByUserId();
        $num = $stmt->rowCount();

        if($num > 0) {
            $notifications_arr = array();
            $notifications_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $notification_item = array(
                    "id_notif" => $id_notif,
                    "text" => $text,
                    "date" => $date,
                    "is_read" => $is_read,
                    "iduser" => $iduser,
                    "id_demande" => $id_demande,
                    "matricule" => $matricule,
                    "status" => $status
                );
                array_push($notifications_arr["records"], $notification_item);
            }

            http_response_code(200);
            echo json_encode($notifications_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune notification trouvée."));
        }
    }

    public function getUnreadCount() {
        $current_user_id = AuthMiddleware::getCurrentUserId();

        $this->notification->iduser = $current_user_id;
        $unread_count = $this->notification->getUnreadByUserId();

        http_response_code(200);
        echo json_encode(array("unread_count" => $unread_count));
    }

    public function markAsRead() {
        $current_user_id = AuthMiddleware::getCurrentUserId();

        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->id_notif)) {
            $this->notification->id_notif = $data->id_notif;
            $this->notification->iduser = $current_user_id;

            if($this->notification->markAsRead()) {
                http_response_code(200);
                echo json_encode(array("message" => "Notification marquée comme lue."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la mise à jour de la notification."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID notification requis."));
        }
    }

    public function markAllAsRead() {
        $current_user_id = AuthMiddleware::getCurrentUserId();

        $this->notification->iduser = $current_user_id;

        if($this->notification->markAllAsRead()) {
            http_response_code(200);
            echo json_encode(array("message" => "Toutes les notifications marquées comme lues."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur lors de la mise à jour des notifications."));
        }
    }
}
?>
