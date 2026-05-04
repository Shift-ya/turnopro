package com.turnow.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple health check endpoint for Fly.io deployment probes.
 * This endpoint is accessible without authentication.
 */
@RestController
@RequestMapping("/actuator")
public class HealthCheckController {

    @GetMapping("/health")
    public ResponseEntity<HealthStatus> health() {
        return ResponseEntity.ok(new HealthStatus("UP"));
    }

    public record HealthStatus(String status) {}
}
