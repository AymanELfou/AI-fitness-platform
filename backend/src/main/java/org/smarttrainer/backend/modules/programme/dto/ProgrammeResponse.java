package org.smarttrainer.backend.modules.programme.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProgrammeResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String title;
    private String description;
    private int duration;
    private String level;
    private String objective;
    private boolean isGeneratedByAI;
    private boolean isValidatedByCoach;
    private Long coachId;
    private String coachName;
    private List<Long> exerciseIds;
}