<?php
namespace App\Library;

class CriptoX {
    private $chave;
    public function __construct() {
        $this->chave = $_ENV['CHAVE_CRIPTOGRAFIA'];
    }
    public function encryptDescriptor(array $descriptor): string {
        $secretKey = $this->chave;
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $descriptorJson = json_encode($descriptor);
        $encrypted = openssl_encrypt($descriptorJson, 'aes-256-cbc', $secretKey, 0, $iv);
        return base64_encode($iv . $encrypted); 
    }

    public function decryptDescriptor(string $encryptedDescriptor): array {
        $secretKey = $this->chave;
        $data = base64_decode($encryptedDescriptor);
        $ivLength = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($data, 0, $ivLength);
        $encryptedData = substr($data, $ivLength);
        $decryptedJson = openssl_decrypt($encryptedData, 'aes-256-cbc', $secretKey, 0, $iv);
        return json_decode($decryptedJson, true);
    }
}