package org.smarttrainer.backend.modules.review.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.review.dto.ReviewRequest;
import org.smarttrainer.backend.modules.review.dto.ReviewResponse;
import org.smarttrainer.backend.modules.review.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<ReviewResponse> create(@RequestBody ReviewRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("coach/{coachId}")
    public ResponseEntity<List<ReviewResponse>> getByCoachId(@PathVariable Long coachId) {
        return ResponseEntity.ok(service.getByCoachId(coachId));
    }

    @GetMapping("client/{clientId}")
    public ResponseEntity<List<ReviewResponse>> getByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(service.getByClientId(clientId));
    }

    @GetMapping("coach/{coachId}/rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long coachId) {
        return ResponseEntity.ok(service.getAverageRating(coachId));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<ReviewResponse> update(
            @PathVariable Long id,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}