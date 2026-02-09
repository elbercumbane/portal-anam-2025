package com.anam.repository;

import com.anam.entity.SympathizerRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SympathizerRegistrationRepository extends JpaRepository<SympathizerRegistration, UUID> {

    List<SympathizerRegistration> findAllByOrderByCreatedAtDesc();
}
