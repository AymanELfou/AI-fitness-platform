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