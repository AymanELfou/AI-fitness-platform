package org.smarttrainer.backend.modules.seance.dto;

import lombok.Data;

@Data
public class SeanceRequest {
    private String status;
    private int duration;
    private String notes;
    private Long coachId;
    private Long programmeId;
}