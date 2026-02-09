package com.anam.repository;

import com.anam.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {

    List<EventRegistration> findAllByOrderByCreatedAtDesc();

    List<EventRegistration> findByEventIdOrderByCreatedAtDesc(String eventId);

    List<EventRegistration> findByEventIdAndParticipantTypeOrderByCreatedAtDesc(String eventId, String participantType);

    long countByEventId(String eventId);

    long countByEventIdAndParticipantType(String eventId, String participantType);
}
