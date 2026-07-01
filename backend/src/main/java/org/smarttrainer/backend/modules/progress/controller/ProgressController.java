package org.smarttrainer.backend.modules.progress.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.progress.dto.ProgressRequest;
import org.smarttrainer.backend.modules.progress.dto.ProgressResponse;
import org.smarttrainer.backend.modules.progress.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/progress")
@RequiredArgsConstructor

public class ProgressController {

    private final ProgressService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_COACH')")
    public ResponseEntity<ProgressResponse> create(@RequestBody ProgressRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ProgressResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("client/{clientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<List<ProgressResponse>> getByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(service.getByClientId(clientId));
    }

    @PostMapping("client/{clientId}/calculate")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT')")
    public ResponseEntity<ProgressResponse> calculateProgress(@PathVariable Long clientId) {
        return ResponseEntity.ok(service.calculate(clientId));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_COACH')")
    public ResponseEntity<ProgressResponse> update(
            @PathVariable Long id,
            @RequestBody ProgressRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}