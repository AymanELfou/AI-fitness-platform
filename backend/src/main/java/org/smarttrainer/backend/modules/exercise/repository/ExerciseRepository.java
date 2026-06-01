package org.smarttrainer.backend.modules.exercise.repository;

import org.smarttrainer.backend.domain.exercice.Difficulty;
import org.smarttrainer.backend.domain.exercice.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByDifficulty(Difficulty difficulty);
    List<Exercise> findByMusclesGroup(String musclesGroup);
}