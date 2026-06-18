package org.smarttrainer.backend.modules.seance.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SeanceResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String status;
    private int duration;
    private String notes;
    private Long coachId;
    private String coachName;
    private Long programmeId;
    private String programmeTitle;
}