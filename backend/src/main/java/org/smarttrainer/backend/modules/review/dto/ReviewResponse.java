package org.smarttrainer.backend.modules.review.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long coachId;
    private String coachName;
    private Long clientId;
    private String clientName;
    private int score;
    private String comment;
}