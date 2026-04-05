<?php
session_start();

class AuthMiddleware {
    public static function checkAuth() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
            http_response_code(401);
            echo json_encode(array("message" => "Accès non autorisé. Veuillez vous connecter."));
            exit();
        }
        return true;
    }

    public static function checkRole($required_role) {
        self::checkAuth();
        
        if ($_SESSION['user_role'] !== $required_role) {
            http_response_code(403);
            echo json_encode(array("message" => "Accès interdit. Rôle insuffisant."));
            exit();
        }
        return true;
    }

    public static function checkRoles($allowed_roles) {
        self::checkAuth();
        
        if (!in_array($_SESSION['user_role'], $allowed_roles)) {
            http_response_code(403);
            echo json_encode(array("message" => "Accès interdit. Rôle insuffisant."));
            exit();
        }
        return true;
    }

    public static function getCurrentUserId() {
        self::checkAuth();
        return $_SESSION['user_id'];
    }

    public static function getCurrentUserRole() {
        self::checkAuth();
        return $_SESSION['user_role'];
    }
}
?>
