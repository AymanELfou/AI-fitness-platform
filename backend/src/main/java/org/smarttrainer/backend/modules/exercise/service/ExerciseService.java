package org.smarttrainer.backend.modules.exercise.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.exercice.Difficulty;
import org.smarttrainer.backend.domain.exercice.Exercise;
import org.smarttrainer.backend.modules.exercise.dto.ExerciseRequest;
import org.smarttrainer.backend.modules.exercise.dto.ExerciseResponse;
import org.smarttrainer.backend.modules.exercise.mapper.ExerciseMapper;
import org.smarttrainer.backend.modules.exercise.repository.ExerciseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    @Transactional
    public ExerciseResponse create(ExerciseRequest request) {
        Exercise exercise = exerciseMapper.toEntity(request);
        return exerciseMapper.toResponse(exerciseRepository.save(exercise));
    }

    public ExerciseResponse getById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        return exerciseMapper.toResponse(exercise);
    }

    public List<ExerciseResponse> getAll() {
        return exerciseRepository.findAll()
                .stream()
                .map(exerciseMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ExerciseResponse> getAdminExercises() {
        return exerciseRepository.findExercisesByCreatorRole(org.smarttrainer.backend.domain.user.Role.ROLE_ADMIN)
                .stream()
                .map(exerciseMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ExerciseResponse> getByDifficulty(Difficulty difficulty) {
        return exerciseRepository.findByDifficulty(difficulty)
                .stream()
                .map(exerciseMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ExerciseResponse> getByMusclesGroup(String musclesGroup) {
        return exerciseRepository.findByMusclesGroup(musclesGroup)
                .stream()
                .map(exerciseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExerciseResponse update(Long id, ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        exercise.setMusclesGroup(request.getMusclesGroup());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setSeries(request.getSeries());
        exercise.setRepetition(request.getRepetition());
        exercise.setDuration(request.getDuration());
        exercise.setCalories(request.getCalories());

        return exerciseMapper.toResponse(exerciseRepository.save(exercise));
    }

    @Transactional
    public void delete(Long id) {
        if (!exerciseRepository.existsById(id)) {
            throw new RuntimeException("Exercise not found");
        }
        exerciseRepository.deleteById(id);
    }
}