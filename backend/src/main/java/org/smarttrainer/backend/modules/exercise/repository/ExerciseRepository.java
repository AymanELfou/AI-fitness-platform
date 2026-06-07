package org.smarttrainer.backend.modules.exercise.repository;

import org.smarttrainer.backend.domain.exercice.Difficulty;
import org.smarttrainer.backend.domain.exercice.Exercise;
import org.smarttrainer.backend.domain.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByDifficulty(Difficulty difficulty);
    List<Exercise> findByMusclesGroup(String musclesGroup);

    @Query("SELECT e FROM Exercise e WHERE e.createdBy IN (SELECT u.id FROM User u JOIN u.roles r WHERE r = :role)")
    List<Exercise> findExercisesByCreatorRole(@Param("role") Role role);
}