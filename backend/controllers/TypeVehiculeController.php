<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/TypeVehicule.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class TypeVehiculeController {
    private $db;
    private $type_vehicule;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->type_vehicule = new TypeVehicule($this->db);
    }

    public function create() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->type) &&
            !empty($data->icone)
        ) {
            $this->type_vehicule->type = $data->type;
            $this->type_vehicule->icone = $data->icone;

            if($this->type_vehicule->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Type de véhicule créé avec succès.",
                    "idtype" => $this->type_vehicule->idtype
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création du type de véhicule."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Type et icône requis."));
        }
    }

    public function getAll() {
        AuthMiddleware::checkRoles(['admin', 'client']);

        $stmt = $this->type_vehicule->getAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $types_arr = array();
            $types_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $type_item = array(
                    "idtype" => $idtype,
                    "type" => $type,
                    "icone" => $icone
                );
                array_push($types_arr["records"], $type_item);
            }

            http_response_code(200);
            echo json_encode($types_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucun type de véhicule trouvé."));
        }
    }

    public function getById() {
        AuthMiddleware::checkRoles(['admin']);

        $this->type_vehicule->idtype = isset($_GET['id']) ? $_GET['id'] : 0;

        if($this->type_vehicule->getById()) {
            $type_arr = array(
                "idtype" => $this->type_vehicule->idtype,
                "type" => $this->type_vehicule->type,
                "icone" => $this->type_vehicule->icone
            );

            http_response_code(200);
            echo json_encode($type_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Type de véhicule non trouvé."));
        }
    }

    public function update() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->idtype) &&
            !empty($data->type) &&
            !empty($data->icone)
        ) {
            $this->type_vehicule->idtype = $data->idtype;
            $this->type_vehicule->type = $data->type;
            $this->type_vehicule->icone = $data->icone;

            if($this->type_vehicule->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Type de véhicule mis à jour avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la mise à jour du type de véhicule."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID, type et icône requis."));
        }
    }

    public function delete() {
        AuthMiddleware::checkRole('admin');

        $this->type_vehicule->idtype = isset($_GET['id']) ? $_GET['id'] : 0;

        if($this->type_vehicule->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Type de véhicule supprimé avec succès."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur lors de la suppression du type de véhicule."));
        }
    }
}
?>
