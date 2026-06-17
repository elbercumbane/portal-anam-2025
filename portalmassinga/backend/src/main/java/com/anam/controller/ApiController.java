package com.anam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class ApiController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> apiRoot() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Portal ANAM - API Backend");
        response.put("version", "1.0.0");
        response.put("status", "online");
        response.put("endpoints", Map.of(
            "membros", "/api/membros",
            "home-content", "/api/home-content",
            "health", "/api/actuator/health"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Backend está funcionando corretamente");
        return ResponseEntity.ok(response);
    }
}
