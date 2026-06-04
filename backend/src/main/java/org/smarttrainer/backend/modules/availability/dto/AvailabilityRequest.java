package org.smarttrainer.backend.modules.availability.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AvailabilityRequest {
    private Long coachId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}