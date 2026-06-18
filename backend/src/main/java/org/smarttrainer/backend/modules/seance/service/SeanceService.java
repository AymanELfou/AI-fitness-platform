package org.smarttrainer.backend.modules.seance.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.programme.Programme;
import org.smarttrainer.backend.domain.seance.Seance;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.smarttrainer.backend.modules.programme.repository.ProgrammeRepository;
import org.smarttrainer.backend.modules.seance.dto.SeanceRequest;
import org.smarttrainer.backend.modules.seance.dto.SeanceResponse;
import org.smarttrainer.backend.modules.seance.mapper.SeanceMapper;
import org.smarttrainer.backend.modules.seance.repository.SeanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeanceService {

    private final SeanceRepository seanceRepository;
    private final CoachProfileRepository coachRepository;
    private final ProgrammeRepository programmeRepository;
    private final SeanceMapper seanceMapper;

    @Transactional
    public SeanceResponse create(SeanceRequest request) {
        CoachProfile coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Programme programme = programmeRepository.findById(request.getProgrammeId())
                .orElseThrow(() -> new RuntimeException("Programme not found"));

        Seance seance = seanceMapper.toEntity(request);
        seance.setCoach(coach);
        seance.setProgramme(programme);

        return seanceMapper.toResponse(seanceRepository.save(seance));
    }

    public SeanceResponse getById(Long id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seance not found"));
        return seanceMapper.toResponse(seance);
    }

    public List<SeanceResponse> getAll() {
        return seanceRepository.findAll()
                .stream()
                .map(seanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SeanceResponse> getByCoachId(Long coachId) {
        return seanceRepository.findByCoachId(coachId)
                .stream()
                .map(seanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SeanceResponse> getByProgrammeId(Long programmeId) {
        return seanceRepository.findByProgrammeId(programmeId)
                .stream()
                .map(seanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SeanceResponse> getByStatus(String status) {
        return seanceRepository.findByStatus(status)
                .stream()
                .map(seanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SeanceResponse update(Long id, SeanceRequest request) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seance not found"));

        seance.setStatus(request.getStatus());
        seance.setDuration(request.getDuration());
        seance.setNotes(request.getNotes());

        return seanceMapper.toResponse(seanceRepository.save(seance));
    }

    @Transactional
    public void delete(Long id) {
        if (!seanceRepository.existsById(id)) {
            throw new RuntimeException("Seance not found");
        }
        seanceRepository.deleteById(id);
    }
}