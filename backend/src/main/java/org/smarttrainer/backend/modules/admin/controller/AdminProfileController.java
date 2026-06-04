package org.smarttrainer.backend.modules.admin.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.admin.dto.AdminProfileRequest;
import org.smarttrainer.backend.modules.admin.dto.AdminProfileResponse;
import org.smarttrainer.backend.modules.admin.service.AdminProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/admins")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService service;

    @PostMapping("{userId}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AdminProfileResponse> create(
            @PathVariable Long userId,
            @RequestBody AdminProfileRequest request) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    @GetMapping("{id}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AdminProfileResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("user/{userId}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AdminProfileResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<AdminProfileResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("{id}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AdminProfileResponse> update(
            @PathVariable Long id,
            @RequestBody AdminProfileRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}