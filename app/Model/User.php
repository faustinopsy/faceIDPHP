<?php

namespace App\Model;

class User{
    private int $id;
    private array $rostos;
    private string $email; 

    public function getId(): int {
        return $this->id;
    }
    public function setId(int $id): self{
        $this->id = $id;

        return $this;
    }
    
    public function getRostos(): array {
        return $this->rostos;
    }

    public function setRostos(array $rostos): self {
        $this->rostos = $rostos;
        return $this;
    }

    public function addRosto(array $rosto): self {
        $this->rostos[] = $rosto;
        return $this;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function setEmail(string $email): self {
        $this->email = $email;

        return $this;
    }
    
}