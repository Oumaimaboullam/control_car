<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class AuthController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function register() {
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
            $this->user->role = 'client';

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
                echo json_encode(array("message" => "Utilisateur créé avec succès."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création de l'utilisateur."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->email) &&
            !empty($data->password)
        ) {
            $this->user->email = $data->email;
            $this->user->password = $data->password;

            if($this->user->login()) {
                session_start();
                $_SESSION['user_id'] = $this->user->iduser;
                $_SESSION['user_role'] = $this->user->role;
                $_SESSION['user_name'] = $this->user->nom . ' ' . $this->user->prenom;

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Connexion réussie.",
                    "user" => array(
                        "id" => $this->user->iduser,
                        "nom" => $this->user->nom,
                        "prenom" => $this->user->prenom,
                        "email" => $this->user->email,
                        "role" => $this->user->role,
                        "telephone" => $this->user->telephone
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Email ou mot de passe incorrect."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Email et mot de passe requis."));
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        http_response_code(200);
        echo json_encode(array("message" => "Déconnexion réussie."));
    }

    public function getCurrentUser() {
        session_start();
        if(isset($_SESSION['user_id'])) {
            http_response_code(200);
            echo json_encode(array(
                "user" => array(
                    "id" => $_SESSION['user_id'],
                    "name" => $_SESSION['user_name'],
                    "role" => $_SESSION['user_role']
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Non connecté."));
        }
    }
}
?>
