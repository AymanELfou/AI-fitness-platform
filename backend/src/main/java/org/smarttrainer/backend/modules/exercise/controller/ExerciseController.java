package org.smarttrainer.backend.modules.exercise.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.exercice.Difficulty;
import org.smarttrainer.backend.modules.exercise.dto.ExerciseRequest;
import org.smarttrainer.backend.modules.exercise.dto.ExerciseResponse;
import org.smarttrainer.backend.modules.exercise.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ExerciseResponse> create(@RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<ExerciseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("difficulty/{difficulty}")
    public ResponseEntity<List<ExerciseResponse>> getByDifficulty(
            @PathVariable Difficulty difficulty) {
        return ResponseEntity.ok(service.getByDifficulty(difficulty));
    }

    @GetMapping("muscles/{musclesGroup}")
    public ResponseEntity<List<ExerciseResponse>> getByMusclesGroup(
            @PathVariable String musclesGroup) {
        return ResponseEntity.ok(service.getByMusclesGroup(musclesGroup));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COACH', 'ROLE_ADMIN')")
    public ResponseEntity<ExerciseResponse> update(
            @PathVariable Long id,
            @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}