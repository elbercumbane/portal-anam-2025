package com.anam.repository;

import com.anam.entity.ApplicationDependent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationDependentRepository extends JpaRepository<ApplicationDependent, UUID> {
    
    List<ApplicationDependent> findByApplicationId(UUID applicationId);
}

