<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class UserController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function getAll() {
        AuthMiddleware::checkRole('admin');
        
        $stmt = $this->user->getAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $users_arr = array();
            $users_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $user_item = array(
                    "iduser" => $iduser,
                    "nom" => $nom,
                    "prenom" => $prenom,
                    "email" => $email,
                    "telephone" => $telephone,
                    "role" => $role,
                    "is_active" => $is_active,
                    "create_at" => $create_at
                );
                array_push($users_arr["records"], $user_item);
            }

            http_response_code(200);
            echo json_encode($users_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucun utilisateur trouvé."));
        }
    }

    public function getById() {
        $current_user_id = AuthMiddleware::getCurrentUserId();
        $current_user_role = AuthMiddleware::getCurrentUserRole();

        $user_id = isset($_GET['id']) ? $_GET['id'] : $current_user_id;

        if($current_user_role !== 'admin' && $user_id != $current_user_id) {
            http_response_code(403);
            echo json_encode(array("message" => "Accès interdit."));
            return;
        }

        $this->user->iduser = $user_id;

        if($this->user->getById()) {
            $user_arr = array(
                "iduser" => $this->user->iduser,
                "nom" => $this->user->nom,
                "prenom" => $this->user->prenom,
                "adresse" => $this->user->adresse,
                "ville" => $this->user->ville,
                "email" => $this->user->email,
                "telephone" => $this->user->telephone,
                "photo" => $this->user->photo,
                "role" => $this->user->role,
                "is_active" => $this->user->is_active
            );

            http_response_code(200);
            echo json_encode($user_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Utilisateur non trouvé."));
        }
    }

    public function update() {
        $data = json_decode(file_get_contents("php://input"));
        $current_user_id = AuthMiddleware::getCurrentUserId();
        $current_user_role = AuthMiddleware::getCurrentUserRole();

        $user_id = isset($data->iduser) ? $data->iduser : $current_user_id;

        if($current_user_role !== 'admin' && $user_id != $current_user_id) {
            http_response_code(403);
            echo json_encode(array("message" => "Accès interdit."));
            return;
        }

        $this->user->iduser = $user_id;

        if($this->user->getById()) {
            $this->user->nom = isset($data->nom) ? $data->nom : $this->user->nom;
            $this->user->prenom = isset($data->prenom) ? $data->prenom : $this->user->prenom;
            $this->user->adresse = isset($data->adresse) ? $data->adresse : $this->user->adresse;
            $this->user->ville = isset($data->ville) ? $data->ville : $this->user->ville;
            $this->user->email = isset($data->email) ? $data->email : $this->user->email;
            $this->user->telephone = isset($data->telephone) ? $data->telephone : $this->user->telephone;
            $this->user->password = isset($data->password) ? $data->password : '';

            if($this->user->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Utilisateur mis à jour avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la mise à jour de l'utilisateur."));
            }
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Utilisateur non trouvé."));
        }
    }

    public function toggleActive() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->iduser)) {
            $this->user->iduser = $data->iduser;

            if($this->user->toggleActive()) {
                http_response_code(200);
                echo json_encode(array("message" => "Statut de l'utilisateur mis à jour avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la mise à jour du statut."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID utilisateur requis."));
        }
    }

    public function createTechnician() {
        AuthMiddleware::checkRole('admin');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->nom) &&
            !empty($data->prenom) &&
            !empty($data->adresse) &&
            !empty($data->ville) &&
            !empty($data->email) &&
            !empty($data->telephone) &&
            !empty($data->password)
        ) {
            $this->user->nom = $data->nom;
            $this->user->prenom = $data->prenom;
            $this->user->adresse = $data->adresse;
            $this->user->ville = $data->ville;
            $this->user->email = $data->email;
            $this->user->telephone = $data->telephone;
            $this->user->password = $data->password;
            $this->user->role = 'technicien';

            if($this->user->emailExists()) {
                http_response_code(400);
                echo json_encode(array("message" => "Cet email est déjà utilisé."));
                return;
            }

            if($this->user->telephoneExists()) {
                http_response_code(400);
                echo json_encode(array("message" => "Ce numéro de téléphone est déjà utilisé."));
                return;
            }

            if($this->user->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Technicien créé avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création du technicien."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
    }
}
?>
