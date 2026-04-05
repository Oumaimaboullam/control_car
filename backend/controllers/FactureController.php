<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Facture.php';
require_once __DIR__ . '/../models/Demande.php';
require_once __DIR__ . '/../models/Notification.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class FactureController {
    private $db;
    private $facture;
    private $notification;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->facture = new Facture($this->db);
        $this->notification = new Notification($this->db);
    }

    public function create() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->id_demande) &&
            !empty($data->prix)
        ) {
            $this->facture->id_demande = $data->id_demande;
            $this->facture->prix = $data->prix;

            if($this->facture->create()) {
                // Notifier le client
                $this->notification->iduser = $data->iduser; // ID du client
                $this->notification->id_demande = $data->id_demande;
                $this->notification->text = "Une facture a été générée pour votre demande. Montant : " . $data->prix . " €";
                $this->notification->create();

                http_response_code(201);
                echo json_encode(array(
                    "message" => "Facture créée avec succès.",
                    "idfacture" => $this->facture->idfacture
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création de la facture."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID demande et prix requis."));
        }
    }

    public function getAll() {
        AuthMiddleware::checkRole('admin');

        $stmt = $this->facture->getAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $factures_arr = array();
            $factures_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $facture_item = array(
                    "idfacture" => $idfacture,
                    "prix" => $prix,
                    "id_demande" => $id_demande,
                    "matricule" => $matricule,
                    "date" => $date,
                    "number" => $number,
                    "client_nom" => $nom,
                    "client_prenom" => $prenom
                );
                array_push($factures_arr["records"], $facture_item);
            }

            http_response_code(200);
            echo json_encode($factures_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune facture trouvée."));
        }
    }

    public function getById() {
        $current_user_id = AuthMiddleware::getCurrentUserId();
        $current_user_role = AuthMiddleware::getCurrentUserRole();

        $facture_id = isset($_GET['id']) ? $_GET['id'] : 0;

        $this->facture->idfacture = $facture_id;
        $facture_data = $this->facture->getById();

        if($facture_data) {
            // Vérifier les permissions
            if($current_user_role === 'client') {
                // Le client ne peut voir que ses propres factures
                // On doit vérifier que la demande appartient au client
                require_once '../models/Demande.php';
                $demande = new Demande($this->db);
                $demande->id_demande = $facture_data['id_demande'];
                $demande_data = $demande->getById();
                
                if(!$demande_data || $demande_data['iduser'] != $current_user_id) {
                    http_response_code(403);
                    echo json_encode(array("message" => "Accès interdit."));
                    return;
                }
            }

            http_response_code(200);
            echo json_encode($facture_data);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Facture non trouvée."));
        }
    }

    public function getByDemandeId() {
        $current_user_id = AuthMiddleware::getCurrentUserId();
        $current_user_role = AuthMiddleware::getCurrentUserRole();

        $demande_id = isset($_GET['id_demande']) ? $_GET['id_demande'] : 0;

        // Vérifier les permissions
        if($current_user_role === 'client') {
            require_once '../models/Demande.php';
            $demande = new Demande($this->db);
            $demande->id_demande = $demande_id;
            $demande_data = $demande->getById();
            
            if(!$demande_data || $demande_data['iduser'] != $current_user_id) {
                http_response_code(403);
                echo json_encode(array("message" => "Accès interdit."));
                return;
            }
        }

        $this->facture->id_demande = $demande_id;
        $facture_data = $this->facture->getByDemandeId();

        if($facture_data) {
            http_response_code(200);
            echo json_encode($facture_data);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune facture trouvée pour cette demande."));
        }
    }
}
?>
