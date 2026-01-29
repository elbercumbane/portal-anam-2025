package com.anam.repository;

import com.anam.entity.HomeContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeContentRepository extends JpaRepository<HomeContent, UUID> {
    
    Optional<HomeContent> findBySectionKey(String sectionKey);
    
    List<HomeContent> findByIsActiveTrueOrderByOrderIndexAsc();
    
    List<HomeContent> findAllByOrderByOrderIndexAsc();
    
    List<HomeContent> findBySectionKeyStartingWith(String prefix);
}

