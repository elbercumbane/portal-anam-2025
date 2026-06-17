package com.anam.repository;

import com.anam.entity.Apoiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApoianteRepository extends JpaRepository<Apoiante, UUID> {
    
    // Buscar por email
    Optional<Apoiante> findByEmail(String email);
    
    // Buscar por status
    List<Apoiante> findByStatus(String status);
    
    // Verificar se email já existe
    boolean existsByEmail(String email);
    
    // Buscar por nome (busca parcial)
    List<Apoiante> findByNomeCompletoContainingIgnoreCase(String nome);
    
    // Buscar por tipo de apoio
    List<Apoiante> findByTipoApoio(String tipoApoio);
}
