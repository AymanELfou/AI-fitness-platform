package org.smarttrainer.backend.modules.client.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.client.dto.ClientProfileRequest;
import org.smarttrainer.backend.modules.client.dto.ClientProfileResponse;
import org.smarttrainer.backend.modules.client.service.ClientProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/clients")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ClientController {

    private final ClientProfileService service;

    @PostMapping("{userId}/profile")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<ClientProfileResponse> create(
            @PathVariable Long userId,
            @RequestBody ClientProfileRequest request) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    @GetMapping("{id}/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ClientProfileResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("user/{userId}/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ClientProfileResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<List<ClientProfileResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("{id}/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_ADMIN')")
    public ResponseEntity<ClientProfileResponse> update(
            @PathVariable Long id,
            @RequestBody ClientProfileRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("{userId}/upgrade")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_ADMIN')")
    public ResponseEntity<ClientProfileResponse> upgradeToPremium(@PathVariable Long userId) {
        return ResponseEntity.ok(service.upgradeToPremium(userId));
    }

    @DeleteMapping("{id}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}