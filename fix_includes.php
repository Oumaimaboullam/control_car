<?php
// Script pour corriger tous les chemins d'include dans les contrôleurs
$controllers = glob('controllers/*.php');

foreach ($controllers as $controller) {
    $content = file_get_contents($controller);
    
    // Remplacer les require_once relatifs par des chemins absolus avec __DIR__
    $content = preg_replace(
        "/require_once\s+['\"]\.\.\/\.\//",
        "require_once __DIR__ . '/../",
        $content
    );
    
    file_put_contents($controller, $content);
}

echo "Chemins d'include corrigés dans tous les contrôleurs!\n";
?>
