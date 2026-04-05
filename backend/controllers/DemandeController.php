<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Demande.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Notification.php';
require_once __DIR__ . '/../models/Facture.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class DemandeController {
    private $db;
    private $demande;
    private $notification;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->demande = new Demande($this->db);
        $this->notification = new Notification($this->db);
    }

    public function create() {
        AuthMiddleware::checkRole('client');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->matricule) &&
            !empty($data->adresse) &&
            !empty($data->telephone) &&
            !empty($data->time) &&
            !empty($data->date) &&
            !empty($data->idmarque) &&
            !empty($data->idtype)
        ) {
            $this->demande->iduser = AuthMiddleware::getCurrentUserId();
            $this->demande->matricule = $data->matricule;
            $this->demande->adresse = $data->adresse;
            $this->demande->telephone = $data->telephone;
            $this->demande->time = $data->time;
            $this->demande->date = $data->date;
            $this->demande->status = 'en attente';
            $this->demande->lien = isset($data->lien) ? $data->lien : '';
            $this->demande->idmarque = $data->idmarque;
            $this->demande->idtype = $data->idtype;
            $this->demande->number = date('y') . date('m') . date('d') . rand(1000, 9999);

            if($this->demande->create()) {
                // Notifier l'administrateur
                $this->notification->iduser = 1; // ID de l'admin (à adapter)
                $this->notification->id_demande = $this->demande->id_demande;
                $this->notification->text = "Nouvelle demande de diagnostic créée pour le véhicule " . $this->demande->matricule;
                $this->notification->create();

                http_response_code(201);
                echo json_encode(array(
                    "message" => "Demande créée avec succès.",
                    "id_demande" => $this->demande->id_demande,
                    "number" => $this->demande->number
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création de la demande."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
    }

    public function getAll() {
        AuthMiddleware::checkRoles(['admin']);

        $stmt = $this->demande->getAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $demandes_arr = array();
            $demandes_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $demande_item = array(
                    "id_demande" => $id_demande,
                    "iduser" => $iduser,
                    "matricule" => $matricule,
                    "adresse" => $adresse,
                    "telephone" => $telephone,
                    "time" => $time,
                    "date" => $date,
                    "status" => $status,
                    "lien" => $lien,
                    "idmarque" => $idmarque,
                    "idtype" => $idtype,
                    "number" => $number,
                    "create_at" => $create_at,
                    "client_nom" => $nom,
                    "client_prenom" => $prenom,
                    "client_email" => $email,
                    "marque" => $marque,
                    "type" => $type
                );
                array_push($demandes_arr["records"], $demande_item);
            }

            http_response_code(200);
            echo json_encode($demandes_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune demande trouvée."));
        }
    }

    public function getByUser() {
        AuthMiddleware::checkRole('client');

        $this->demande->iduser = AuthMiddleware::getCurrentUserId();
        $stmt = $this->demande->getByUserId();
        $num = $stmt->rowCount();

        if($num > 0) {
            $demandes_arr = array();
            $demandes_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $demande_item = array(
                    "id_demande" => $id_demande,
                    "matricule" => $matricule,
                    "adresse" => $adresse,
                    "telephone" => $telephone,
                    "time" => $time,
                    "date" => $date,
                    "status" => $status,
                    "lien" => $lien,
                    "idmarque" => $idmarque,
                    "idtype" => $idtype,
                    "number" => $number,
                    "create_at" => $create_at,
                    "marque" => $marque,
                    "type" => $type
                );
                array_push($demandes_arr["records"], $demande_item);
            }

            http_response_code(200);
            echo json_encode($demandes_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune demande trouvée."));
        }
    }

    public function getById() {
        $current_user_id = AuthMiddleware::getCurrentUserId();
        $current_user_role = AuthMiddleware::getCurrentUserRole();

        $demande_id = isset($_GET['id']) ? $_GET['id'] : 0;

        $this->demande->id_demande = $demande_id;
        $demande_data = $this->demande->getById();

        if($demande_data) {
            // Vérifier les permissions
            if($current_user_role === 'client' && $demande_data['iduser'] != $current_user_id) {
                http_response_code(403);
                echo json_encode(array("message" => "Accès interdit."));
                return;
            }

            http_response_code(200);
            echo json_encode($demande_data);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Demande non trouvée."));
        }
    }

    public function updateStatus() {
        AuthMiddleware::checkRoles(['admin', 'technicien']);

        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->id_demande) && !empty($data->status)) {
            $this->demande->id_demande = $data->id_demande;
            $this->demande->status = $data->status;

            if($this->demande->updateStatus()) {
                // Notifier le client
                $this->notification->iduser = $data->iduser; // ID du client
                $this->notification->id_demande = $data->id_demande;
                $this->notification->text = "Le statut de votre demande a été mis à jour : " . $data->status;
                $this->notification->create();

                http_response_code(200);
                echo json_encode(array("message" => "Statut mis à jour avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la mise à jour du statut."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID demande et statut requis."));
        }
    }

    public function getByStatus() {
        AuthMiddleware::checkRoles(['admin', 'technicien']);

        $status = isset($_GET['status']) ? $_GET['status'] : '';

        if(!empty($status)) {
            $this->demande->status = $status;
            $stmt = $this->demande->getByStatus();
            $num = $stmt->rowCount();

            if($num > 0) {
                $demandes_arr = array();
                $demandes_arr["records"] = array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $demande_item = array(
                        "id_demande" => $id_demande,
                        "iduser" => $iduser,
                        "matricule" => $matricule,
                        "adresse" => $adresse,
                        "telephone" => $telephone,
                        "time" => $time,
                        "date" => $date,
                        "status" => $status,
                        "lien" => $lien,
                        "idmarque" => $idmarque,
                        "idtype" => $idtype,
                        "number" => $number,
                        "create_at" => $create_at,
                        "client_nom" => $nom,
                        "client_prenom" => $prenom,
                        "client_email" => $email,
                        "marque" => $marque,
                        "type" => $type
                    );
                    array_push($demandes_arr["records"], $demande_item);
                }

                http_response_code(200);
                echo json_encode($demandes_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Aucune demande trouvée pour ce statut."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Statut requis."));
        }
    }
}
?>
