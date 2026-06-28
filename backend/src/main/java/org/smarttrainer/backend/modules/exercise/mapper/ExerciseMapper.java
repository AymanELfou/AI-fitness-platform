package org.smarttrainer.backend.modules.exercise.mapper;

import org.smarttrainer.backend.domain.exercice.Exercise;
import org.smarttrainer.backend.modules.exercise.dto.ExerciseRequest;
import org.smarttrainer.backend.modules.exercise.dto.ExerciseResponse;
import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {

    public ExerciseResponse toResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .createdAt(exercise.getCreatedAt())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .musclesGroup(exercise.getMusclesGroup())
                .difficulty(exercise.getDifficulty())
                .series(exercise.getSeries())
                .repetition(exercise.getRepetition())
                .duration(exercise.getDuration())
                .imageUrl(exercise.getImageUrl())
                .calories(exercise.getCalories())
                .createdByRole(exercise.getCreatedByRole())
                .createdBy(exercise.getCreatedBy())
                .build();
    }

    public Exercise toEntity(ExerciseRequest request) {
        Exercise exercise = new Exercise();
        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        exercise.setMusclesGroup(request.getMusclesGroup());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setSeries(request.getSeries());
        exercise.setRepetition(request.getRepetition());
        exercise.setDuration(request.getDuration());
        exercise.setCalories(request.getCalories());
        exercise.setImageUrl(request.getImageUrl());
        exercise.setCreatedByRole(request.getCreatedByRole());
        exercise.setCreatedBy(request.getCreatedBy());
        return exercise;
    }
}