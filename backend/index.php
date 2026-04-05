<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$path_info = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path_info, '/'));

$endpoint = $path_parts[0] ?? '';
$resource = $path_parts[1] ?? '';
$id = $path_parts[2] ?? '';

session_start();

switch ($endpoint) {
    case 'api':
        switch ($resource) {
            case 'auth':
                require_once 'controllers/AuthController.php';
                $controller = new AuthController();
                
                if ($request_method === 'POST') {
                    $action = $path_parts[2] ?? '';
                    switch ($action) {
                        case 'register':
                            $controller->register();
                            break;
                        case 'login':
                            $controller->login();
                            break;
                        case 'logout':
                            $controller->logout();
                            break;
                        default:
                            http_response_code(404);
                            echo json_encode(array("message" => "Endpoint non trouvé."));
                            break;
                    }
                } elseif ($request_method === 'GET') {
                    if ($path_parts[2] === 'current') {
                        $controller->getCurrentUser();
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message" => "Endpoint non trouvé."));
                    }
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'users':
                require_once 'controllers/UserController.php';
                $controller = new UserController();
                
                if ($request_method === 'GET') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->getById();
                    } else {
                        $controller->getAll();
                    }
                } elseif ($request_method === 'POST') {
                    $data = json_decode(file_get_contents("php://input"));
                    if ($data && isset($data->role) && $data->role === 'technicien') {
                        $controller->createTechnician();
                    } else {
                        http_response_code(405);
                        echo json_encode(array("message" => "Méthode non autorisée."));
                    }
                } elseif ($request_method === 'PUT') {
                    $controller->update();
                } elseif ($request_method === 'PATCH') {
                    $controller->toggleActive();
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'demandes':
                require_once 'controllers/DemandeController.php';
                $controller = new DemandeController();
                
                if ($request_method === 'GET') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->getById();
                    } elseif (isset($_GET['status'])) {
                        $controller->getByStatus();
                    } elseif (isset($_GET['user'])) {
                        $controller->getByUser();
                    } else {
                        $controller->getAll();
                    }
                } elseif ($request_method === 'POST') {
                    $controller->create();
                } elseif ($request_method === 'PUT') {
                    $controller->updateStatus();
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'diagnostics':
                require_once 'controllers/DiagnosticController.php';
                $controller = new DiagnosticController();
                
                if ($request_method === 'GET') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->getById();
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message" => "Endpoint non trouvé."));
                    }
                } elseif ($request_method === 'POST') {
                    $controller->create();
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'types':
                require_once 'controllers/TypeVehiculeController.php';
                $controller = new TypeVehiculeController();
                
                if ($request_method === 'GET') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->getById();
                    } else {
                        $controller->getAll();
                    }
                } elseif ($request_method === 'POST') {
                    $controller->create();
                } elseif ($request_method === 'PUT') {
                    $controller->update();
                } elseif ($request_method === 'DELETE') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->delete();
                    } else {
                        http_response_code(400);
                        echo json_encode(array("message" => "ID requis."));
                    }
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'marques':
                require_once 'controllers/MarqueVehiculeController.php';
                $controller = new MarqueVehiculeController();
                
                if ($request_method === 'GET') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->getById();
                    } elseif (isset($_GET['idtype'])) {
                        $controller->getByType();
                    } else {
                        $controller->getAll();
                    }
                } elseif ($request_method === 'POST') {
                    $controller->create();
                } elseif ($request_method === 'PUT') {
                    $controller->update();
                } elseif ($request_method === 'DELETE') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->delete();
                    } else {
                        http_response_code(400);
                        echo json_encode(array("message" => "ID requis."));
                    }
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'notifications':
                require_once 'controllers/NotificationController.php';
                $controller = new NotificationController();
                
                if ($request_method === 'GET') {
                    if (isset($_GET['unread'])) {
                        $controller->getUnreadCount();
                    } else {
                        $controller->getByUser();
                    }
                } elseif ($request_method === 'PUT') {
                    $data = json_decode(file_get_contents("php://input"));
                    if ($data && isset($data->mark_all)) {
                        $controller->markAllAsRead();
                    } else {
                        $controller->markAsRead();
                    }
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            case 'factures':
                require_once 'controllers/FactureController.php';
                $controller = new FactureController();
                
                if ($request_method === 'GET') {
                    if ($id) {
                        $_GET['id'] = $id;
                        $controller->getById();
                    } elseif (isset($_GET['id_demande'])) {
                        $controller->getByDemandeId();
                    } else {
                        $controller->getAll();
                    }
                } elseif ($request_method === 'POST') {
                    $controller->create();
                } else {
                    http_response_code(405);
                    echo json_encode(array("message" => "Méthode non autorisée."));
                }
                break;

            default:
                http_response_code(404);
                echo json_encode(array("message" => "Ressource non trouvée."));
                break;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(array("message" => "Endpoint non trouvé."));
        break;
}
?>
