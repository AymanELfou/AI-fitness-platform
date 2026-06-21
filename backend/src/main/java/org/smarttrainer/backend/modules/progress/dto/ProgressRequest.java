package org.smarttrainer.backend.modules.progress.dto;

import lombok.Data;

@Data
public class ProgressRequest {
    private String performance;
    private Double muscleMasse;
    private Double fatMasse;
    private Long clientId;
}