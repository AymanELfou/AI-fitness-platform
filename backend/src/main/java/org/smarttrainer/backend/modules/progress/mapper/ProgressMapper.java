package org.smarttrainer.backend.modules.progress.mapper;

import org.smarttrainer.backend.domain.progress.Progress;
import org.smarttrainer.backend.modules.progress.dto.ProgressRequest;
import org.smarttrainer.backend.modules.progress.dto.ProgressResponse;
import org.springframework.stereotype.Component;

@Component
public class ProgressMapper {

    public ProgressResponse toResponse(Progress progress) {
        return ProgressResponse.builder()
                .id(progress.getId())
                .createdAt(progress.getCreatedAt())
                .performance(progress.getPerformance())
                .muscleMasse(progress.getMuscleMasse())
                .fatMasse(progress.getFatMasse())
                .clientId(progress.getClient().getId())
                .build();
    }

    public Progress toEntity(ProgressRequest request) {
        Progress progress = new Progress();
        progress.setPerformance(request.getPerformance());
        progress.setMuscleMasse(request.getMuscleMasse());
        progress.setFatMasse(request.getFatMasse());
        return progress;
    }
}