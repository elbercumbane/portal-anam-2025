package com.anam.controller;

import com.anam.dto.CancelEventDTO;
import com.anam.dto.CreateEventDTO;
import com.anam.dto.EventDTO;
import com.anam.entity.Event;
import com.anam.repository.EventRegistrationRepository;
import com.anam.repository.EventRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAll() {
        List<Event> events = eventRepository.findAllByOrderByEventDateAsc();
        List<EventDTO> dtos = events.stream()
                .map(e -> toDto(e, registrationRepository.countByEventId(e.getId())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getById(@PathVariable String id) {
        return eventRepository.findById(id)
                .map(e -> ResponseEntity.ok(toDto(e, registrationRepository.countByEventId(e.getId()))))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateEventDTO dto) {
        String id = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        Event event = new Event();
        event.setId(id);
        event.setTitle(dto.getTitle());
        event.setEventDateStart(dto.getEventDateStart());
        event.setEventDateEnd(dto.getEventDateEnd());
        event.setEndDate(dto.getEndDate());
        event.setLocation(dto.getLocation());
        event.setTimeSlot(dto.getTimeSlot());
        event.setDescription(dto.getDescription());
        event.setImageUrl(dto.getImageUrl());
        event.setLevelAccess(dto.getLevelAccess() != null ? dto.getLevelAccess() : "publico");
        event.setEventDate(formatEventDateDisplay(event.getEventDateStart(), event.getEventDateEnd()));
        event.setIsCancelled(false);
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        event = eventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(event, 0L));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody EventDTO dto) {
        return eventRepository.findById(id)
                .map(event -> {
                    if (Boolean.TRUE.equals(event.getIsCancelled())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Evento cancelado não pode ser editado.");
                    }
                    if (event.isPast()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Eventos passados não podem ser editados.");
                    }
                    if (dto.getTitle() != null && !dto.getTitle().isBlank()) event.setTitle(dto.getTitle());
                    if (dto.getEventDateStart() != null) event.setEventDateStart(dto.getEventDateStart());
                    if (dto.getEventDateEnd() != null) event.setEventDateEnd(dto.getEventDateEnd());
                    if (dto.getEndDate() != null) event.setEndDate(dto.getEndDate());
                    if (dto.getLocation() != null) event.setLocation(dto.getLocation());
                    if (dto.getTimeSlot() != null) event.setTimeSlot(dto.getTimeSlot());
                    if (dto.getDescription() != null) event.setDescription(dto.getDescription());
                    if (dto.getImageUrl() != null) event.setImageUrl(dto.getImageUrl());
                    if (dto.getLevelAccess() != null) event.setLevelAccess(dto.getLevelAccess());
                    event.setEventDate(formatEventDateDisplay(event.getEventDateStart(), event.getEventDateEnd()));
                    eventRepository.save(event);
                    return ResponseEntity.ok(toDto(event, registrationRepository.countByEventId(event.getId())));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable String id, @Valid @RequestBody CancelEventDTO dto) {
        return eventRepository.findById(id)
                .map(event -> {
                    if (Boolean.TRUE.equals(event.getIsCancelled())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Evento já está cancelado.");
                    }
                    if (event.isPast()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Só pode cancelar eventos dentro do prazo (não passados).");
                    }
                    event.setIsCancelled(true);
                    event.setCancelledAt(LocalDateTime.now());
                    event.setCancelledMessage(dto.getMessage());
                    eventRepository.save(event);
                    return ResponseEntity.ok(toDto(event, registrationRepository.countByEventId(event.getId())));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private static String formatEventDateDisplay(String start, String end) {
        if (start == null && end == null) return null;
        if (start == null) return end;
        if (end == null || start.equals(end)) return start;
        return start + " - " + end;
    }

    private EventDTO toDto(Event e, long registrationCount) {
        EventDTO dto = new EventDTO();
        dto.setId(e.getId());
        dto.setTitle(e.getTitle());
        dto.setEventDate(e.getEventDate());
        dto.setEventDateStart(e.getEventDateStart());
        dto.setEventDateEnd(e.getEventDateEnd());
        dto.setEndDate(e.getEndDate());
        dto.setLocation(e.getLocation());
        dto.setTimeSlot(e.getTimeSlot());
        dto.setDescription(e.getDescription());
        dto.setImageUrl(e.getImageUrl());
        dto.setLevelAccess(e.getLevelAccess());
        dto.setRegistrationCount(registrationCount);
        dto.setIsCancelled(e.getIsCancelled());
        dto.setCancelledAt(e.getCancelledAt());
        dto.setCancelledMessage(e.getCancelledMessage());
        boolean past = e.isPast();
        dto.setCanEdit(!Boolean.TRUE.equals(e.getIsCancelled()) && !past);
        dto.setCanCancel(!Boolean.TRUE.equals(e.getIsCancelled()) && !past);
        return dto;
    }
}
