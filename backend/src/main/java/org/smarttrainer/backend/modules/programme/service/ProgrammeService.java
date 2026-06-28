package org.smarttrainer.backend.modules.programme.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.exercice.Exercise;
import org.smarttrainer.backend.domain.programme.Programme;
import org.smarttrainer.backend.modules.client.repository.ClientProfileRepository;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.smarttrainer.backend.modules.exercise.repository.ExerciseRepository;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeRequest;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeResponse;
import org.smarttrainer.backend.modules.programme.mapper.ProgrammeMapper;
import org.smarttrainer.backend.modules.programme.repository.ProgrammeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgrammeService {

    private final ProgrammeRepository programmeRepository;
    private final CoachProfileRepository coachRepository;
    private final ExerciseRepository exerciseRepository;
    private final ClientProfileRepository clientRepository;
    private final ProgrammeMapper programmeMapper;

    @Transactional
    public ProgrammeResponse create(ProgrammeRequest request) {
        CoachProfile coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        List<Exercise> exercises = request.getExerciseIds() != null
                ? exerciseRepository.findAllById(request.getExerciseIds())
                : new ArrayList<>();

        Programme programme = programmeMapper.toEntity(request);
        programme.setCoach(coach);
        programme.setExercises(exercises);

        Programme savedProgramme = programmeRepository.save(programme);

        // Assign clients if provided (ClientProfile owns the relationship)
        if (request.getClientIds() != null && !request.getClientIds().isEmpty()) {
            List<ClientProfile> clients = clientRepository.findAllById(request.getClientIds());
            for (ClientProfile client : clients) {
                if (!client.getProgrammes().contains(savedProgramme)) {
                    client.getProgrammes().add(savedProgramme);
                }
            }
            clientRepository.saveAll(clients);
            savedProgramme.setClients(clients);
        }

        return programmeMapper.toResponse(savedProgramme);
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

    //create or validate programe
    @Transactional
    public ProgrammeResponse validate(Long id) {
        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programme not found"));
        programme.setIsValidatedByCoach(true);
        return programmeMapper.toResponse(programmeRepository.save(programme));
    }

    @Transactional
    public ProgrammeResponse update(Long id, ProgrammeRequest request) {
        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programme not found"));

        List<Exercise> exercises = request.getExerciseIds() != null
                ? exerciseRepository.findAllById(request.getExerciseIds())
                : new ArrayList<>();

        programme.setTitle(request.getTitle());
        programme.setDescription(request.getDescription());
        programme.setDuration(request.getDuration());
        programme.setLevel(request.getLevel());
        programme.setObjective(request.getObjective());
        programme.setExercises(exercises);

        Programme savedProgramme = programmeRepository.save(programme);

        // Update clients if provided (ClientProfile owns the relationship)
        if (request.getClientIds() != null) {
            List<ClientProfile> clients = clientRepository.findAllById(request.getClientIds());
            
            // Remove programme from old clients
            List<ClientProfile> oldClients = savedProgramme.getClients() != null ? savedProgramme.getClients() : new ArrayList<>();
            for (ClientProfile oldClient : oldClients) {
                if (!clients.contains(oldClient)) {
                    oldClient.getProgrammes().remove(savedProgramme);
                    clientRepository.save(oldClient);
                }
            }
            
            // Add programme to new clients
            for (ClientProfile newClient : clients) {
                if (!newClient.getProgrammes().contains(savedProgramme)) {
                    newClient.getProgrammes().add(savedProgramme);
                }
            }
            clientRepository.saveAll(clients);
            savedProgramme.setClients(clients);
        }

        return programmeMapper.toResponse(savedProgramme);
    }

    /**
     * Assign or replace the list of clients for a programme.
     */
    @Transactional
    public ProgrammeResponse assignClients(Long programmeId, List<Long> clientIds) {
        Programme programme = programmeRepository.findById(programmeId)
                .orElseThrow(() -> new RuntimeException("Programme not found"));

        List<ClientProfile> clients = clientRepository.findAllById(clientIds);
        programme.setClients(clients);

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