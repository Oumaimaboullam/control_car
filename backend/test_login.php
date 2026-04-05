<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/User.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    echo "Database connection: SUCCESS\n";
    
    $user = new User($conn);
    $user->email = 'admin@controlcar.com';
    $user->password = 'password';
    $result = $user->login();
    echo "Login result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";
    
    if ($result) {
        echo "User ID: " . $user->iduser . "\n";
        echo "User Role: " . $user->role . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
