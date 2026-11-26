package com.knithappens.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health check used by the frontend skeleton and the smoke test.
 *
 * <p>{@code GET /api/health} answers {@code {"status":"ok"}} and needs no login.
 */
@RestController
public class HealthController {

    /** Small response object. Records are immutable and Spring turns them into JSON. */
    public record HealthResponse(String status) {
    }

    @GetMapping("/api/health")
    public HealthResponse health() {
        return new HealthResponse("ok");
    }
}
