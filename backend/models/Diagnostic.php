<?php
class Diagnostic {
    private $conn;
    private $table_name = "diagnostic";

    public $id;
    
    // Extérieur
    public $apparence_exterieure;
    public $apparence_exterieure_image;
    public $carrosserie;
    public $carrosserie_image;
    public $pneu_av_gauche;
    public $pneu_av_gauche_image;
    public $pneu_av_droit;
    public $pneu_av_droit_image;
    public $pneu_ar_droit;
    public $pneu_ar_droit_image;
    public $pneu_ar_gauche;
    public $pneu_ar_gauche_image;
    public $roue_secours;
    public $roue_secours_image;
    public $phare_ar_droit;
    public $phare_ar_droit_image;
    public $phare_ar_gauche;
    public $phare_ar_gauche_image;
    public $phare_av_gauche;
    public $phare_av_gauche_image;
    public $phare_av_droit;
    public $phare_av_droit_image;
    public $clignotants;
    public $clignotants_image;
    public $ampoules;
    public $ampoules_image;
    public $essuie_glaces;
    public $essuie_glaces_image;
    public $conforme_exterieur;

    // Intérieur
    public $apparence_interieur;
    public $apparence_interieur_image;
    public $habitacle;
    public $habitacle_image;
    public $tableau_bord;
    public $tableau_bord_image;
    public $voyants;
    public $voyants_image;
    public $compteur;
    public $compteur_image;
    public $airbags;
    public $airbags_image;
    public $ceintures;
    public $ceintures_image;
    public $vitres;
    public $vitres_image;
    public $retroviseurs;
    public $retroviseurs_image;
    public $conforme_interieur;

    // Mécanique
    public $bloc_moteur;
    public $bloc_moteur_image;
    public $transmission;
    public $transmission_image;
    public $echappement;
    public $echappement_image;
    public $demi_train_av_droit;
    public $demi_train_av_droit_image;
    public $demi_train_av_gauche;
    public $demi_train_av_gauche_image;
    public $demi_train_ar_droit;
    public $demi_train_ar_droit_image;
    public $demi_train_ar_gauche;
    public $demi_train_ar_gauche_image;
    public $conforme_mecanique;

    // Test véhicule
    public $suspension;
    public $suspension_image;
    public $direction;
    public $direction_image;
    public $fumee;
    public $bruit_moteur;
    public $bruit_moteur_image;
    public $dommages_image;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET ";

        $fields = [];
        $values = [];

        // Extérieur
        $exterior_fields = [
            'apparence_exterieure', 'apparence_exterieure_image', 'carrosserie', 'carrosserie_image',
            'pneu_av_gauche', 'pneu_av_gauche_image', 'pneu_av_droit', 'pneu_av_droit_image',
            'pneu_ar_droit', 'pneu_ar_droit_image', 'pneu_ar_gauche', 'pneu_ar_gauche_image',
            'roue_secours', 'roue_secours_image', 'phare_ar_droit', 'phare_ar_droit_image',
            'phare_ar_gauche', 'phare_ar_gauche_image', 'phare_av_gauche', 'phare_av_gauche_image',
            'phare_av_droit', 'phare_av_droit_image', 'clignotants', 'clignotants_image',
            'ampoules', 'ampoules_image', 'essuie_glaces', 'essuie_glaces_image', 'conforme_exterieur'
        ];

        // Intérieur
        $interior_fields = [
            'apparence_interieur', 'apparence_interieur_image', 'habitacle', 'habitacle_image',
            'tableau_bord', 'tableau_bord_image', 'voyants', 'voyants_image', 'compteur',
            'compteur_image', 'airbags', 'airbags_image', 'ceintures', 'ceintures_image',
            'vitres', 'vitres_image', 'retroviseurs', 'retroviseurs_image', 'conforme_interieur'
        ];

        // Mécanique
        $mechanic_fields = [
            'bloc_moteur', 'bloc_moteur_image', 'transmission', 'transmission_image',
            'echappement', 'echappement_image', 'demi_train_av_droit', 'demi_train_av_droit_image',
            'demi_train_av_gauche', 'demi_train_av_gauche_image', 'demi_train_ar_droit',
            'demi_train_ar_droit_image', 'demi_train_ar_gauche', 'demi_train_ar_gauche_image', 'conforme_mecanique'
        ];

        // Test véhicule
        $test_fields = [
            'suspension', 'suspension_image', 'direction', 'direction_image', 'fumee',
            'bruit_moteur', 'bruit_moteur_image', 'dommages_image', 'status'
        ];

        $all_fields = array_merge($exterior_fields, $interior_fields, $mechanic_fields, $test_fields);

        foreach ($all_fields as $field) {
            $fields[] = "$field = :$field";
            $values[":$field"] = $this->$field;
        }

        $query .= implode(", ", $fields);

        $stmt = $this->conn->prepare($query);

        foreach ($values as $param => $value) {
            $stmt->bindValue($param, $value);
        }

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getById() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            // Charger toutes les propriétés
            foreach ($row as $key => $value) {
                $this->$key = $value;
            }
            return true;
        }
        return false;
    }

    public function getByDemandeId($id_demande) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id_demande);
        $stmt->execute();

        return $stmt;
    }
}
?>
