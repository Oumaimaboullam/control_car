<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Diagnostic.php';
require_once __DIR__ . '/../models/Demande.php';
require_once __DIR__ . '/../models/Notification.php';
require_once '../middleware/AuthMiddleware.php';

class DiagnosticController {
    private $db;
    private $diagnostic;
    private $demande;
    private $notification;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->diagnostic = new Diagnostic($this->db);
        $this->demande = new Demande($this->db);
        $this->notification = new Notification($this->db);
    }

    public function create() {
        AuthMiddleware::checkRole('technicien');

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->id_demande) &&
            isset($data->conforme_exterieur) &&
            isset($data->conforme_interieur) &&
            isset($data->conforme_mecanique) &&
            !empty($data->status)
        ) {
            $this->diagnostic->id = $data->id_demande;

            // Assigner toutes les propriétés du diagnostic
            $fields = [
                'apparence_exterieure', 'apparence_exterieure_image', 'carrosserie', 'carrosserie_image',
                'pneu_av_gauche', 'pneu_av_gauche_image', 'pneu_av_droit', 'pneu_av_droit_image',
                'pneu_ar_droit', 'pneu_ar_droit_image', 'pneu_ar_gauche', 'pneu_ar_gauche_image',
                'roue_secours', 'roue_secours_image', 'phare_ar_droit', 'phare_ar_droit_image',
                'phare_ar_gauche', 'phare_ar_gauche_image', 'phare_av_gauche', 'phare_av_gauche_image',
                'phare_av_droit', 'phare_av_droit_image', 'clignotants', 'clignotants_image',
                'ampoules', 'ampoules_image', 'essuie_glaces', 'essuie_glaces_image', 'conforme_exterieur',
                'apparence_interieur', 'apparence_interieur_image', 'habitacle', 'habitacle_image',
                'tableau_bord', 'tableau_bord_image', 'voyants', 'voyants_image', 'compteur',
                'compteur_image', 'airbags', 'airbags_image', 'ceintures', 'ceintures_image',
                'vitres', 'vitres_image', 'retroviseurs', 'retroviseurs_image', 'conforme_interieur',
                'bloc_moteur', 'bloc_moteur_image', 'transmission', 'transmission_image',
                'echappement', 'echappement_image', 'demi_train_av_droit', 'demi_train_av_droit_image',
                'demi_train_av_gauche', 'demi_train_av_gauche_image', 'demi_train_ar_droit',
                'demi_train_ar_droit_image', 'demi_train_ar_gauche', 'demi_train_ar_gauche_image',
                'conforme_mecanique', 'suspension', 'suspension_image', 'direction', 'direction_image',
                'fumee', 'bruit_moteur', 'bruit_moteur_image', 'dommages_image', 'status'
            ];

            foreach ($fields as $field) {
                $this->diagnostic->$field = isset($data->$field) ? $data->$field : '';
            }

            if($this->diagnostic->create()) {
                // Mettre à jour le statut de la demande
                $this->demande->id_demande = $data->id_demande;
                $this->demande->status = 'terminer';
                $this->demande->updateStatus();

                // Notifier le client
                $demande_data = $this->demande->getById();
                if($demande_data) {
                    $this->notification->iduser = $demande_data['iduser'];
                    $this->notification->id_demande = $data->id_demande;
                    $this->notification->text = "Le diagnostic de votre véhicule est terminé. Résultat : " . $data->status;
                    $this->notification->create();
                }

                http_response_code(201);
                echo json_encode(array(
                    "message" => "Diagnostic créé avec succès.",
                    "id" => $this->diagnostic->id
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Erreur lors de la création du diagnostic."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
    }

    public function getById() {
        $current_user_id = AuthMiddleware::getCurrentUserId();
        $current_user_role = AuthMiddleware::getCurrentUserRole();

        $diagnostic_id = isset($_GET['id']) ? $_GET['id'] : 0;

        $this->diagnostic->id = $diagnostic_id;

        if($this->diagnostic->getById()) {
            // Vérifier les permissions - le technicien peut voir tous les diagnostics
            if($current_user_role === 'client') {
                // Le client ne peut voir que ses propres diagnostics
                $this->demande->id_demande = $diagnostic_id;
                $demande_data = $this->demande->getById();
                if(!$demande_data || $demande_data['iduser'] != $current_user_id) {
                    http_response_code(403);
                    echo json_encode(array("message" => "Accès interdit."));
                    return;
                }
            }

            $diagnostic_arr = array(
                "id" => $this->diagnostic->id,
                "apparence_exterieure" => $this->diagnostic->apparence_exterieure,
                "apparence_exterieure_image" => $this->diagnostic->apparence_exterieure_image,
                "carrosserie" => $this->diagnostic->carrosserie,
                "carrosserie_image" => $this->diagnostic->carrosserie_image,
                "pneu_av_gauche" => $this->diagnostic->pneu_av_gauche,
                "pneu_av_gauche_image" => $this->diagnostic->pneu_av_gauche_image,
                "pneu_av_droit" => $this->diagnostic->pneu_av_droit,
                "pneu_av_droit_image" => $this->diagnostic->pneu_av_droit_image,
                "pneu_ar_droit" => $this->diagnostic->pneu_ar_droit,
                "pneu_ar_droit_image" => $this->diagnostic->pneu_ar_droit_image,
                "pneu_ar_gauche" => $this->diagnostic->pneu_ar_gauche,
                "pneu_ar_gauche_image" => $this->diagnostic->pneu_ar_gauche_image,
                "roue_secours" => $this->diagnostic->roue_secours,
                "roue_secours_image" => $this->diagnostic->roue_secours_image,
                "phare_ar_droit" => $this->diagnostic->phare_ar_droit,
                "phare_ar_droit_image" => $this->diagnostic->phare_ar_droit_image,
                "phare_ar_gauche" => $this->diagnostic->phare_ar_gauche,
                "phare_ar_gauche_image" => $this->diagnostic->phare_ar_gauche_image,
                "phare_av_gauche" => $this->diagnostic->phare_av_gauche,
                "phare_av_gauche_image" => $this->diagnostic->phare_av_gauche_image,
                "phare_av_droit" => $this->diagnostic->phare_av_droit,
                "phare_av_droit_image" => $this->diagnostic->phare_av_droit_image,
                "clignotants" => $this->diagnostic->clignotants,
                "clignotants_image" => $this->diagnostic->clignotants_image,
                "ampoules" => $this->diagnostic->ampoules,
                "ampoules_image" => $this->diagnostic->ampoules_image,
                "essuie_glaces" => $this->diagnostic->essuie_glaces,
                "essuie_glaces_image" => $this->diagnostic->essuie_glaces_image,
                "conforme_exterieur" => $this->diagnostic->conforme_exterieur,
                "apparence_interieur" => $this->diagnostic->apparence_interieur,
                "apparence_interieur_image" => $this->diagnostic->apparence_interieur_image,
                "habitacle" => $this->diagnostic->habitacle,
                "habitacle_image" => $this->diagnostic->habitacle_image,
                "tableau_bord" => $this->diagnostic->tableau_bord,
                "tableau_bord_image" => $this->diagnostic->tableau_bord_image,
                "voyants" => $this->diagnostic->voyants,
                "voyants_image" => $this->diagnostic->voyants_image,
                "compteur" => $this->diagnostic->compteur,
                "compteur_image" => $this->diagnostic->compteur_image,
                "airbags" => $this->diagnostic->airbags,
                "airbags_image" => $this->diagnostic->airbags_image,
                "ceintures" => $this->diagnostic->ceintures,
                "ceintures_image" => $this->diagnostic->ceintures_image,
                "vitres" => $this->diagnostic->vitres,
                "vitres_image" => $this->diagnostic->vitres_image,
                "retroviseurs" => $this->diagnostic->retroviseurs,
                "retroviseurs_image" => $this->diagnostic->retroviseurs_image,
                "conforme_interieur" => $this->diagnostic->conforme_interieur,
                "bloc_moteur" => $this->diagnostic->bloc_moteur,
                "bloc_moteur_image" => $this->diagnostic->bloc_moteur_image,
                "transmission" => $this->diagnostic->transmission,
                "transmission_image" => $this->diagnostic->transmission_image,
                "echappement" => $this->diagnostic->echappement,
                "echappement_image" => $this->diagnostic->echappement_image,
                "demi_train_av_droit" => $this->diagnostic->demi_train_av_droit,
                "demi_train_av_droit_image" => $this->diagnostic->demi_train_av_droit_image,
                "demi_train_av_gauche" => $this->diagnostic->demi_train_av_gauche,
                "demi_train_av_gauche_image" => $this->diagnostic->demi_train_av_gauche_image,
                "demi_train_ar_droit" => $this->diagnostic->demi_train_ar_droit,
                "demi_train_ar_droit_image" => $this->diagnostic->demi_train_ar_droit_image,
                "demi_train_ar_gauche" => $this->diagnostic->demi_train_ar_gauche,
                "demi_train_ar_gauche_image" => $this->diagnostic->demi_train_ar_gauche_image,
                "conforme_mecanique" => $this->diagnostic->conforme_mecanique,
                "suspension" => $this->diagnostic->suspension,
                "suspension_image" => $this->diagnostic->suspension_image,
                "direction" => $this->diagnostic->direction,
                "direction_image" => $this->diagnostic->direction_image,
                "fumee" => $this->diagnostic->fumee,
                "bruit_moteur" => $this->diagnostic->bruit_moteur,
                "bruit_moteur_image" => $this->diagnostic->bruit_moteur_image,
                "dommages_image" => $this->diagnostic->dommages_image,
                "status" => $this->diagnostic->status,
                "created_at" => $this->diagnostic->created_at
            );

            http_response_code(200);
            echo json_encode($diagnostic_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Diagnostic non trouvé."));
        }
    }
}
?>
