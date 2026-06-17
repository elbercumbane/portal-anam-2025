package com.anam.repository;

import com.anam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMembroId(UUID membroId);

    boolean existsByEmail(String email);

    boolean existsByMembroId(UUID membroId);
}
