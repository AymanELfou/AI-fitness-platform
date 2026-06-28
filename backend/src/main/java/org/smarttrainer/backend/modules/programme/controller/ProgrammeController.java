package org.smarttrainer.backend.modules.programme.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeRequest;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeResponse;
import org.smarttrainer.backend.modules.programme.service.ProgrammeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/programmes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")

public class ProgrammeController {

    private final ProgrammeService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ProgrammeResponse> create(@RequestBody ProgrammeRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<ProgrammeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProgrammeResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("coach/{coachId}")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<List<ProgrammeResponse>> getByCoachId(@PathVariable Long coachId) {
        return ResponseEntity.ok(service.getByCoachId(coachId));
    }

    @GetMapping("validated")
    public ResponseEntity<List<ProgrammeResponse>> getValidated() {
        return ResponseEntity.ok(service.getValidatedProgrammes());
    }

    @PatchMapping("{id}/validate")
    @PreAuthorize("hasAuthority('ROLE_COACH')")
    public ResponseEntity<ProgrammeResponse> validate(@PathVariable Long id) {
        return ResponseEntity.ok(service.validate(id));
    }

    @PatchMapping("{id}/assign-clients")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ProgrammeResponse> assignClients(
            @PathVariable Long id,
            @RequestBody List<Long> clientIds) {
        return ResponseEntity.ok(service.assignClients(id, clientIds));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ProgrammeResponse> update(
            @PathVariable Long id,
            @RequestBody ProgrammeRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}