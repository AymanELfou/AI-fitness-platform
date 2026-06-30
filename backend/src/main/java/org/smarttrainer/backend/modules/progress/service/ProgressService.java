package org.smarttrainer.backend.modules.progress.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.progress.Progress;
import org.smarttrainer.backend.modules.client.repository.ClientProfileRepository;
import org.smarttrainer.backend.modules.progress.dto.ProgressRequest;
import org.smarttrainer.backend.modules.progress.dto.ProgressResponse;
import org.smarttrainer.backend.modules.progress.mapper.ProgressMapper;
import org.smarttrainer.backend.modules.progress.repository.ProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final ClientProfileRepository clientRepository;
    private final ProgressMapper progressMapper;

    @Transactional
    public ProgressResponse create(ProgressRequest request) {
        ClientProfile client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Progress progress = progressMapper.toEntity(request);
        progress.setClient(client);

        return progressMapper.toResponse(progressRepository.save(progress));
    }

    public ProgressResponse getById(Long id) {
        Progress progress = progressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress not found"));
        return progressMapper.toResponse(progress);
    }

    public List<ProgressResponse> getByClientId(Long clientId) {
        return progressRepository.findByClientIdOrderByCreatedAtAsc(clientId)
                .stream()
                .map(progressMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProgressResponse calculate(Long clientId) {
        ClientProfile client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (client.getPoids() == null || client.getTaille() == null || client.getAge() <= 0) {
            throw new RuntimeException("Client profile is missing weight, height, or age for calculation");
        }

        double imc = client.calculateIMC();
        
        // Approximate Fat Mass calculation (Deurenberg formula generic average)
        double fatPercentage = (1.20 * imc) + (0.23 * client.getAge()) - 10.8;
        if (fatPercentage < 5) fatPercentage = 5;
        
        double fatMasse = client.getPoids() * (fatPercentage / 100.0);
        double leanBodyMass = client.getPoids() - fatMasse;
        double muscleMasse = leanBodyMass * 0.50; // Muscle mass is roughly 50% of lean mass

        Progress progress = new Progress();
        progress.setClient(client);
        progress.setFatMasse(Math.round(fatMasse * 100.0) / 100.0);
        progress.setMuscleMasse(Math.round(muscleMasse * 100.0) / 100.0);
        progress.setPerformance("Calculated from IMC");

        return progressMapper.toResponse(progressRepository.save(progress));
    }

    @Transactional
    public ProgressResponse update(Long id, ProgressRequest request) {
        Progress progress = progressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        progress.setPerformance(request.getPerformance());
        progress.setMuscleMasse(request.getMuscleMasse());
        progress.setFatMasse(request.getFatMasse());

        return progressMapper.toResponse(progressRepository.save(progress));
    }

    @Transactional
    public void delete(Long id) {
        if (!progressRepository.existsById(id)) {
            throw new RuntimeException("Progress not found");
        }
        progressRepository.deleteById(id);
    }
}