package org.smarttrainer.backend.modules.community.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.community.dto.CommunityRequest;
import org.smarttrainer.backend.modules.community.dto.CommunityResponse;
import org.smarttrainer.backend.modules.community.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB', 'ROLE_ADMIN')")
    public ResponseEntity<CommunityResponse> create(@RequestBody CommunityRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<CommunityResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("club/{clubId}")
    public ResponseEntity<CommunityResponse> getByClubId(@PathVariable Long clubId) {
        return ResponseEntity.ok(service.getByClubId(clubId));
    }

    @GetMapping
    public ResponseEntity<List<CommunityResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB', 'ROLE_ADMIN')")
    public ResponseEntity<CommunityResponse> update(
            @PathVariable Long id,
            @RequestBody CommunityRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}