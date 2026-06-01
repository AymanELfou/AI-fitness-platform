package org.smarttrainer.backend.modules.exercise.dto;

import lombok.Builder;
import lombok.Data;
import org.smarttrainer.backend.domain.exercice.Difficulty;

import java.time.LocalDateTime;

@Data
@Builder
public class ExerciseResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String name;
    private String description;
    private String musclesGroup;
    private Difficulty difficulty;
    private int series;
    private int repetition;
    private int duration;
    private int calories;
}