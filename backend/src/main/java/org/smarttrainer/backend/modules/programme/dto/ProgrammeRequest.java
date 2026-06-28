package org.smarttrainer.backend.modules.programme.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProgrammeRequest {
    private String title;
    private String description;
    private int duration;
    private String level;
    private String objective;
    private boolean isGeneratedByAI;
    private Long coachId;
    private List<Long> exerciseIds;
    // IDs des clients auxquels ce programme est assigné
    private List<Long> clientIds;
}