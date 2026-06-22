package org.smarttrainer.backend.modules.coach.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileRequest;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileResponse;
import org.smarttrainer.backend.modules.coach.service.CoachProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/coaches")
@CrossOrigin(origins = "http://localhost:4200")

@RequiredArgsConstructor
public class CoachProfileController {

    private final CoachProfileService service;

    // CREATE
    @PostMapping("{userId}/profile")
    @PreAuthorize("hasAuthority('ROLE_COACH')")
    public ResponseEntity<CoachProfileResponse> create(
            @PathVariable Long userId,
            @RequestBody CoachProfileRequest request
    ) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    // GET BY ID
    @GetMapping("{id}")
    public ResponseEntity<CoachProfileResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }

    // GET BY USER ID
    @GetMapping("user/{userId}")
    public ResponseEntity<CoachProfileResponse> getByUserId(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Récupérer les coachs par l'ID du club
    @GetMapping("club/{clubId}")
    public ResponseEntity<List<CoachProfileResponse>> getAllByClubId(@PathVariable Long clubId) {
        return ResponseEntity.ok(service.getByClubId(clubId));
    }

    // UPDATE
    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_COACH')")
    public ResponseEntity<CoachProfileResponse> update(
            @PathVariable Long id,
            @RequestBody CoachProfileRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    //DELETE
    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}