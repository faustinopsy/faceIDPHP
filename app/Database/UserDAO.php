<?php
namespace App\Database;

use PDO;
use PDOException;

class UserDAO {
    private $conexao;
    public function __construct(PDO $conexao) {
        $this->conexao = $conexao;
    }
    public function buscarUsuarioPorEmail($email) {
        try {
            $stmt = $this->conexao->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }

    public function inserirUsuario($email) {
        try {
            $stmt = $this->conexao->prepare("INSERT INTO users (email) VALUES (:email)");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            return $this->conexao->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }

    public function inserirRosto($userId, $rostoJson) {
        try {
            $stmt = $this->conexao->prepare("INSERT INTO faces (idusers, faces) VALUES (:idusers, :faces)");
            $stmt->bindParam(':idusers', $userId);
            $stmt->bindParam(':faces', $rostoJson);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
    
    public function buscarTodosUsuarios() {
        try {
            $stmt = $this->conexao->prepare("SELECT * FROM users");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
    public function buscarUsuarioPorId($id) {
        try {
            $stmt = $this->conexao->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
    public function atualizarUsuario($id, $nome, $registro) {
        try {
            $stmt = $this->conexao->prepare("UPDATE users SET nome = :nome, registro = :registro WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':registro', $registro);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
    public function excluirUsuario($id) {
        try {
            $stmt = $this->conexao->prepare("DELETE FROM users WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
    public function buscarRostosPorUsuario($userId) {
        try {
            $stmt = $this->conexao->prepare("SELECT faces FROM faces WHERE idusers = :idusers");
            $stmt->bindParam(':idusers', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $faces = $stmt->fetchAll(PDO::FETCH_COLUMN, 0); 
            return $faces; 
   
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
    
}
