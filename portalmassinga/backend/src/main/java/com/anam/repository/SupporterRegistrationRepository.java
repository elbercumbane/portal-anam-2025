package com.anam.repository;

import com.anam.entity.SupporterRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupporterRegistrationRepository extends JpaRepository<SupporterRegistration, UUID> {

    List<SupporterRegistration> findAllByOrderByCreatedAtDesc();
}
