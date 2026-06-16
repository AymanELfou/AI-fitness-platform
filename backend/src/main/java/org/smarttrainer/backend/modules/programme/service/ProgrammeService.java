package org.smarttrainer.backend.modules.programme.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.exercice.Exercise;
import org.smarttrainer.backend.domain.programme.Programme;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.smarttrainer.backend.modules.exercise.repository.ExerciseRepository;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeRequest;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeResponse;
import org.smarttrainer.backend.modules.programme.mapper.ProgrammeMapper;
import org.smarttrainer.backend.modules.programme.repository.ProgrammeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgrammeService {

    private final ProgrammeRepository programmeRepository;
    private final CoachProfileRepository coachRepository;
    private final ExerciseRepository exerciseRepository;
    private final ProgrammeMapper programmeMapper;

    @Transactional
    public ProgrammeResponse create(ProgrammeRequest request) {
        CoachProfile coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        List<Exercise> exercises = exerciseRepository.findAllById(request.getExerciseIds());

        Programme programme = programmeMapper.toEntity(request);
        programme.setCoach(coach);
        programme.setExercises(exercises);

        return programmeMapper.toResponse(programmeRepository.save(programme));
    }

    public ProgrammeResponse getById(Long id) {
        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programme not found"));
        return programmeMapper.toResponse(programme);
    }

    public List<ProgrammeResponse> getAll() {
        return programmeRepository.findAll()
                .stream()
                .map(programmeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProgrammeResponse> getByCoachId(Long coachId) {
        return programmeRepository.findByCoachId(coachId)
                .stream()
                .map(programmeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProgrammeResponse> getValidatedProgrammes() {
        return programmeRepository.findByIsValidatedByCoachTrue()
                .stream()
                .map(programmeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProgrammeResponse validate(Long id) {
        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programme not found"));
        programme.setValidatedByCoach(true);
        return programmeMapper.toResponse(programmeRepository.save(programme));
    }

    @Transactional
    public ProgrammeResponse update(Long id, ProgrammeRequest request) {
        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programme not found"));

        List<Exercise> exercises = exerciseRepository.findAllById(request.getExerciseIds());

        programme.setTitle(request.getTitle());
        programme.setDescription(request.getDescription());
        programme.setDuration(request.getDuration());
        programme.setLevel(request.getLevel());
        programme.setObjective(request.getObjective());
        programme.setExercises(exercises);

        return programmeMapper.toResponse(programmeRepository.save(programme));
    }

    @Transactional
    public void delete(Long id) {
        if (!programmeRepository.existsById(id)) {
            throw new RuntimeException("Programme not found");
        }
        programmeRepository.deleteById(id);
    }
}