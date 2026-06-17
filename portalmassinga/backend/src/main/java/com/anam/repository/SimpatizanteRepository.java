package com.anam.repository;

import com.anam.entity.Simpatizante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SimpatizanteRepository extends JpaRepository<Simpatizante, UUID> {
    
    // Buscar por email
    Optional<Simpatizante> findByEmail(String email);
    
    // Buscar por status
    List<Simpatizante> findByStatus(String status);
    
    // Verificar se email já existe
    boolean existsByEmail(String email);
    
    // Buscar por nome (busca parcial)
    List<Simpatizante> findByNomeCompletoContainingIgnoreCase(String nome);
}
