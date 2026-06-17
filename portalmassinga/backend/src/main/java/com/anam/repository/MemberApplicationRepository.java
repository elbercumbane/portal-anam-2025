package com.anam.repository;

import com.anam.entity.MemberApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberApplicationRepository extends JpaRepository<MemberApplication, UUID> {
    
    List<MemberApplication> findByStatus(String status);
    
    Optional<MemberApplication> findByEmail(String email);
    
    Optional<MemberApplication> findByNuitIgnoreCase(String nuit);
    
    List<MemberApplication> findByStatusOrderByCreatedAtDesc(String status);
}

