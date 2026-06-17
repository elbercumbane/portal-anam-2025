package com.anam.repository;

import com.anam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByMemberApplicationId(UUID memberApplicationId);

    boolean existsByEmailIgnoreCase(String email);
}
