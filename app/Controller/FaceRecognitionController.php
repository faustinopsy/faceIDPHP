<?php
namespace App\Controller;

use App\Database\UserDAO;
use App\Library\CriptoX;
use PDOException;

class FaceRecognitionController {
    private $userDAO;
    private $threshold;
    private $debugEnabled;
    private $CriptoX;

    public function __construct(UserDAO $userDAO, float $threshold = 0.1, bool $debugEnabled = false) {
        $this->userDAO = $userDAO;
        $this->threshold = $threshold;
        $this->debugEnabled = $debugEnabled;
        $this->CriptoX = new CriptoX();
    }

    public function setDebug(bool $enabled) {
        $this->debugEnabled = $enabled;
    }

    private function debugLog(string $message, $data = null) {
        if ($this->debugEnabled) {
            $logFile = __DIR__ . '/../../logs/face_recognition.log';
            $logEntry = date('Y-m-d H:i:s') . ' - ' . $message;
            if ($data !== null) {
                $logEntry .= ': ' . print_r($data, true);
            }
            $logEntry .= PHP_EOL;
            error_log($logEntry, 3, $logFile);
        }
    }

    private function euclideanDistance(array $vec1, array $vec2): float {
        $sum = 0.0;
        $count = min(count($vec1), count($vec2));

        for ($i = 0; $i < $count; $i++) {
            $diff = $vec1[$i] - $vec2[$i];
            $sum += pow($diff, 2);
        }
        return sqrt($sum);
    }

    private function cosineSimilarity(array $vec1, array $vec2): float {
        $dotProduct = array_sum(array_map(fn($a, $b) => $a * $b, $vec1, $vec2));
        $magnitudeA = sqrt(array_sum(array_map(fn($a) => $a * $a, $vec1)));
        $magnitudeB = sqrt(array_sum(array_map(fn($b) => $b * $b, $vec2)));
    
        return ($magnitudeA * $magnitudeB) == 0 ? 0 : $dotProduct / ($magnitudeA * $magnitudeB);
    }    

    public function recognize(array $inputDescriptor, $debug) {
        $useCosineSimilarity = filter_var($_ENV['SIMILARIDADE'], FILTER_VALIDATE_BOOLEAN);
        $this->setDebug($debug);
        try {
            $usuarios = $this->userDAO->buscarTodosUsuarios();
            $bestMatch = null;
            $bestDistance = $useCosineSimilarity ? -INF : INF;
            $closestVector = null;
            
            foreach ($usuarios as $usuario) {
                $rostosCriptografados = $this->userDAO->buscarRostosPorUsuario($usuario['id']);
                foreach ($rostosCriptografados as $rostoCriptografado) {
                    $rosto = $this->CriptoX->decryptDescriptor($rostoCriptografado);
                    $distance = $useCosineSimilarity 
                        ? $this->cosineSimilarity($inputDescriptor, $rosto) 
                        : $this->euclideanDistance($inputDescriptor, $rosto);
                    
                    if (($useCosineSimilarity && $distance > $bestDistance) || 
                        (!$useCosineSimilarity && $distance < $bestDistance)) {
                        $bestDistance = $distance;
                        $bestMatch = $usuario;
                        $closestVector = $rosto;
                    }
                }
            }
    
            if (($useCosineSimilarity && $bestDistance >= $this->threshold) || 
                (!$useCosineSimilarity && $bestDistance <= $this->threshold)) {
                
                $this->debugLog("Rosto reconhecido com distância", $bestDistance);
                $debugData = [];
                
                if ($this->debugEnabled && $closestVector) {
                    for ($i = 0; $i < count($inputDescriptor); $i++) {
                        $vec1 = $inputDescriptor[$i];
                        $vec2 = $closestVector[$i];
                        $diff = abs($vec1 - $vec2);
    
                        $debugData[] = [
                            'vec1' => $vec1,
                            'vec2' => $vec2,
                            'diff' => $diff
                        ];
                    }
                }
    
                return [
                    'status' => true,
                    'message' => 'Rosto reconhecido',
                    'usuario' => $bestMatch,
                    'distance' => $bestDistance,
                    'method' => $useCosineSimilarity ? 'cosine_similarity' : 'euclidean_distance',
                    'debugPoints' => $debugData
                ];
            } else {
                $this->debugLog("Nenhum rosto reconhecido. Melhor distância encontrada", $bestDistance);
    
                return [
                    'status' => false,
                    'message' => 'Nenhum rosto reconhecido',
                    'distance' => $bestDistance,
                    'debugPoints' => []
                ];
            }
        } catch (PDOException $e) {
            $this->debugLog("Erro na operação de reconhecimento", $e->getMessage());
            return [
                'status' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
}
