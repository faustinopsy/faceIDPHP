<?php
namespace App\Database;

use PDO;
use PDOException;

class Conexao {
    private static $conexao;

    public static function getConexao() {
        if (self::$conexao === null) {
            $host = $_ENV['DATABASE_HOST'];
            $db   = $_ENV['DATABASE_NAME'];
            $user = $_ENV['DATABASE_USER'];
            $pass = $_ENV['DATABASE_PASSWORD'];
            $charset = 'utf8mb4';
            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$conexao = new PDO($dsn, $user, $pass, $options);
                self::verificarImportacao();
            } catch (PDOException $e) {
                throw new PDOException($e->getMessage(), (int)$e->getCode());
            }
        }
        return self::$conexao;
    }

    private static function verificarImportacao() {
        try {
            $stmt = self::$conexao->query("SELECT COUNT(*) FROM usuarios");
            $totalUsuarios = $stmt->fetchColumn();
            
            if ($totalUsuarios == 0) {
                self::importarBanco();
            }
        } catch (PDOException $e) {
            error_log("Tabela 'usuarios' não encontrada. Tentando importar o banco...");
            self::importarBanco();
        }
    }

    private static function importarBanco() {
        $caminhoSQL = __DIR__ . "/import.sql"; 

        if (file_exists($caminhoSQL)) {
            try {
                $sql = file_get_contents($caminhoSQL);
                self::$conexao->exec($sql);
                error_log("Importação do banco realizada com sucesso!");
            } catch (PDOException $e) {
                error_log(" Erro ao importar o banco: " . $e->getMessage());
            }
        } else {
            error_log("Arquivo import.sql não encontrado em: $caminhoSQL");
        }
    }
}
