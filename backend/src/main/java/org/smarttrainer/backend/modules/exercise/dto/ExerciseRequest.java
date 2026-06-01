package org.smarttrainer.backend.modules.exercise.dto;

import lombok.Data;
import org.smarttrainer.backend.domain.exercice.Difficulty;

@Data
public class ExerciseRequest {
    private String name;
    private String description;
    private String musclesGroup;
    private Difficulty difficulty;
    private int series;
    private int repetition;
    private int duration;
    private int calories;
    private String imageUrl;
}