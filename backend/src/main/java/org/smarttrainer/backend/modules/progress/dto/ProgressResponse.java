package org.smarttrainer.backend.modules.progress.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProgressResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String performance;
    private Double muscleMasse;
    private Double fatMasse;
    private Long clientId;
}