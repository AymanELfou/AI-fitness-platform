package org.smarttrainer.backend.modules.abonnement.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.abonnement.SubscriptionType;
import org.smarttrainer.backend.modules.abonnement.dto.AbonnementRequest;
import org.smarttrainer.backend.modules.abonnement.dto.AbonnementResponse;
import org.smarttrainer.backend.modules.abonnement.service.AbonnementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/abonnements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AbonnementController {

    private final AbonnementService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB', 'ROLE_ADMIN')")
    public ResponseEntity<AbonnementResponse> create(@RequestBody AbonnementRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<AbonnementResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<AbonnementResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("club/{clubId}")
    public ResponseEntity<List<AbonnementResponse>> getByClubId(@PathVariable Long clubId) {
        return ResponseEntity.ok(service.getByClubId(clubId));
    }

    @GetMapping("type/{type}")
    public ResponseEntity<List<AbonnementResponse>> getByType(@PathVariable SubscriptionType type) {
        return ResponseEntity.ok(service.getByType(type));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB', 'ROLE_ADMIN')")
    public ResponseEntity<AbonnementResponse> update(
            @PathVariable Long id,
            @RequestBody AbonnementRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}