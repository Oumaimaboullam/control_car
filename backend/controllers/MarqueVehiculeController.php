<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/MarqueVehicule.php';
require_once __DIR__ . '/../models/TypeVehicule.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class MarqueVehiculeController {
    private $db;
    private $marque_vehicule;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->marque_vehicule = new MarqueVehicule($this->db);
    }

    public function create() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->idtype) &&
            !empty($data->marque) &&
            !empty($data->icone)
        ) {
            $this->marque_vehicule->idtype = $data->idtype;
            $this->marque_vehicule->marque = $data->marque;
            $this->marque_vehicule->icone = $data->icone;

            if($this->marque_vehicule->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Marque de véhicule créée avec succès.",
                    "idmarque" => $this->marque_vehicule->idmarque
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création de la marque de véhicule."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Type, marque et icône requis."));
        }
    }

    public function getAll() {
        AuthMiddleware::checkRoles(['admin', 'client']);

        $stmt = $this->marque_vehicule->getAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $marques_arr = array();
            $marques_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $marque_item = array(
                    "idmarque" => $idmarque,
                    "idtype" => $idtype,
                    "marque" => $marque,
                    "icone" => $icone,
                    "type" => $type
                );
                array_push($marques_arr["records"], $marque_item);
            }

            http_response_code(200);
            echo json_encode($marques_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune marque de véhicule trouvée."));
        }
    }

    public function getByType() {
        AuthMiddleware::checkRoles(['admin', 'client']);

        $this->marque_vehicule->idtype = isset($_GET['idtype']) ? $_GET['idtype'] : 0;

        $stmt = $this->marque_vehicule->getByType();
        $num = $stmt->rowCount();

        if($num > 0) {
            $marques_arr = array();
            $marques_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $marque_item = array(
                    "idmarque" => $idmarque,
                    "idtype" => $idtype,
                    "marque" => $marque,
                    "icone" => $icone
                );
                array_push($marques_arr["records"], $marque_item);
            }

            http_response_code(200);
            echo json_encode($marques_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucune marque trouvée pour ce type."));
        }
    }

    public function getById() {
        AuthMiddleware::checkRoles(['admin']);

        $this->marque_vehicule->idmarque = isset($_GET['id']) ? $_GET['id'] : 0;

        $marque_data = $this->marque_vehicule->getById();

        if($marque_data) {
            http_response_code(200);
            echo json_encode($marque_data);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Marque de véhicule non trouvée."));
        }
    }

    public function update() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->idmarque) &&
            !empty($data->idtype) &&
            !empty($data->marque) &&
            !empty($data->icone)
        ) {
            $this->marque_vehicule->idmarque = $data->idmarque;
            $this->marque_vehicule->idtype = $data->idtype;
            $this->marque_vehicule->marque = $data->marque;
            $this->marque_vehicule->icone = $data->icone;

            if($this->marque_vehicule->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Marque de véhicule mise à jour avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la mise à jour de la marque de véhicule."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID, type, marque et icône requis."));
        }
    }

    public function delete() {
        AuthMiddleware::checkRole('admin');

        $this->marque_vehicule->idmarque = isset($_GET['id']) ? $_GET['id'] : 0;

        if($this->marque_vehicule->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Marque de véhicule supprimée avec succès."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur lors de la suppression de la marque de véhicule."));
        }
    }
}
?>
