<?php

namespace App;

require "../vendor/autoload.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

use App\Database\Conexao;
use App\Database\UserDAO;
use App\Model\User;
use App\Controller\UserController;
use App\Controller\FaceRecognitionController;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__FILE__, 2));
$dotenv->load();


$conexao = Conexao::getConexao();
$userDAO = new UserDAO($conexao);
$userController = new UserController($userDAO);
$faceRecognition = new FaceRecognitionController($userDAO, 0.6);


$body = json_decode(file_get_contents('php://input'), true);

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
        $resultado = '';
        if (isset($body['acao'])) {
            $user = new User();
            switch ($body['acao']) {
                case 'registrar':
                    $user->setEmail($body['email']);
                    $user->setRostos($body['rosto']);
                    $resultado = $userController->inserir($user);
                    break;
                case 'login':
                    if (isset($body['descriptor'])) {
                        $descriptor = $body['descriptor'];
                        $debug = $body['debug'];
                        $resultado = $faceRecognition->recognize($descriptor, $debug);
                    } else {
                        $resultado = ['status' => false, 'message' => 'Descriptor não informado'];
                    }
                    break;
            }
        }
        echo json_encode($resultado);
        break;
    case "GET":
        if (isset($_GET['relatorio'])) {
            $resultado = $userController->buscarTodos();
            echo json_encode(["usuarios" => $resultado]);
        } else {
            $id = $_GET['id'] ?? null;
            $resultado = $userController->buscarPorId($id);
            echo json_encode(["usuarios" => $resultado]);
        }
        break;
    case "DELETE":
        $id = $_GET['id'] ?? '';
        $resultado = $userController->excluir($id);
        echo json_encode($resultado);
        break;
}
