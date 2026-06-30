package org.smarttrainer.backend.modules.availability.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityRequest;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityResponse;
import org.smarttrainer.backend.modules.availability.service.AvailabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/availabilities")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COACH')")
    public ResponseEntity<AvailabilityResponse> create(
            @RequestBody AvailabilityRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("coach/{coachId}")
    public ResponseEntity<List<AvailabilityResponse>> getByCoachId(
            @PathVariable Long coachId) {
        return ResponseEntity.ok(service.getByCoachId(coachId));
    }

    @GetMapping("coach/{coachId}/free")
    public ResponseEntity<List<AvailabilityResponse>> getFreeSlots(
            @PathVariable Long coachId) {
        return ResponseEntity.ok(service.getFreeSlotsByCoachId(coachId));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_CLUB')")
    public ResponseEntity<AvailabilityResponse> update(
            @PathVariable Long id,
            @RequestBody AvailabilityRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_CLUB')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}