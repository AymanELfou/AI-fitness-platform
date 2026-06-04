package org.smarttrainer.backend.modules.club.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.club.dto.ClubProfileRequest;
import org.smarttrainer.backend.modules.club.dto.ClubProfileResponse;
import org.smarttrainer.backend.modules.club.service.ClubProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/clubs")
@RequiredArgsConstructor
public class ClubProfileController {

    private final ClubProfileService service;

    @PostMapping("{userId}/profile")
    @PreAuthorize("hasAuthority('ROLE_CLUB')")
    public ResponseEntity<ClubProfileResponse> create(
            @PathVariable Long userId,
            @RequestBody ClubProfileRequest request) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    @GetMapping("{id}/profile")
    public ResponseEntity<ClubProfileResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("user/{userId}/profile")
    public ResponseEntity<ClubProfileResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<ClubProfileResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("{id}/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB', 'ROLE_ADMIN')")
    public ResponseEntity<ClubProfileResponse> update(
            @PathVariable Long id,
            @RequestBody ClubProfileRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}