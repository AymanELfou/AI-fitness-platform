package org.smarttrainer.backend.modules.seance.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.seance.dto.SeanceRequest;
import org.smarttrainer.backend.modules.seance.dto.SeanceResponse;
import org.smarttrainer.backend.modules.seance.service.SeanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/seances")
@RequiredArgsConstructor
public class SeanceController {

    private final SeanceService service;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_COACH')")
    public ResponseEntity<SeanceResponse> create(@RequestBody SeanceRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<SeanceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<SeanceResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("coach/{coachId}")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<List<SeanceResponse>> getByCoachId(@PathVariable Long coachId) {
        return ResponseEntity.ok(service.getByCoachId(coachId));
    }

    @GetMapping("programme/{programmeId}")
    public ResponseEntity<List<SeanceResponse>> getByProgrammeId(@PathVariable Long programmeId) {
        return ResponseEntity.ok(service.getByProgrammeId(programmeId));
    }

    @GetMapping("status/{status}")
    public ResponseEntity<List<SeanceResponse>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(service.getByStatus(status));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_COACH')")
    public ResponseEntity<SeanceResponse> update(
            @PathVariable Long id,
            @RequestBody SeanceRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}