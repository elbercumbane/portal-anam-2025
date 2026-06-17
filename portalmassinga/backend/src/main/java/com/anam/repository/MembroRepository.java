package com.anam.repository;

import com.anam.entity.Membro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembroRepository extends JpaRepository<Membro, UUID> {
    
    // Buscar por email
    Optional<Membro> findByEmail(String email);
    
    // Buscar por status
    List<Membro> findByStatus(String status);
    
    // Verificar se email já existe
    boolean existsByEmail(String email);
    
    // Buscar por nome (busca parcial)
    List<Membro> findByNomeCompletoContainingIgnoreCase(String nome);
}
