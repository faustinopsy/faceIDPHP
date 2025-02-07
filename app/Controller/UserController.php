<?php
namespace App\Controller;

use App\Database\UserDAO;
use App\Model\User;
use App\Library\CriptoX;
use PDOException;

class UserController {
    private $userDAO;
    private $CriptoX;

    public function __construct(UserDAO $userDAO) {
        $this->userDAO = $userDAO;
        $this->CriptoX = new CriptoX();
    }

    public function inserir(User $user) {
        try {
            $usuarioExistente = $this->userDAO->buscarUsuarioPorEmail($user->getEmail());
            if ($usuarioExistente) {
                return ['status' => false, 'message' => 'Email de usuário já existe'];
            }
            $userId = $this->userDAO->inserirUsuario($user->getEmail());
            foreach ($user->getRostos() as $rosto) {
                $rostoCriptografado = $this->CriptoX->encryptDescriptor($rosto);
                $this->userDAO->inserirRosto($userId, $rostoCriptografado);
            }
            return ['status' => true, 'id' => $userId, 'message' => 'Cadastrado com sucesso'];
        } catch (PDOException $e) {
            return ['status' => false, 'error' => $e->getMessage()];
        }
    }

    public function buscarTodos() {
        try {
            $usuariosComRosto = []; 
            $usuarios = $this->userDAO->buscarTodosUsuarios();
            foreach ($usuarios as $usuario) {
                $rostos = $this->userDAO->buscarRostosPorUsuario($usuario['id']);
                if (!empty($rostos)) { 
                    $usuario['rostos'] = $rostos; 
                    $usuariosComRosto[] = $usuario; 
                }
            }
            
            return $usuariosComRosto;
        } catch (PDOException $e) {
            return ['status' => false, 'error' => $e->getMessage()];
        }
    }
    

    public function buscarPorId($id) {
        try {
            $usuario = $this->userDAO->buscarUsuarioPorId($id);
            if ($usuario) {
                unset($usuario['senha']);
                $usuario['rosto'] = $this->userDAO->buscarRostosPorUsuario($usuario['id']);
                return ['status' => true, 'usuario' => $usuario];
            }
            return ['status' => false, 'message' => 'Usuário não encontrado'];
        } catch (PDOException $e) {
            return ['status' => false, 'error' => $e->getMessage()];
        }
    }

    public function atualizar(User $user) {
        try {
            $this->userDAO->atualizarUsuario($user->getId(), $user->getEmail(), $user->getRegistro());
            return ['status' => true, 'message' => 'Usuário atualizado com sucesso'];
        } catch (PDOException $e) {
            return ['status' => false, 'error' => $e->getMessage()];
        }
    }

    public function excluir($id) {
        try {
            $this->userDAO->excluirUsuario($id);
            return ['status' => true, 'message' => 'Usuário excluído com sucesso'];
        } catch (PDOException $e) {
            return ['status' => false, 'error' => $e->getMessage()];
        }
    }
    
}
