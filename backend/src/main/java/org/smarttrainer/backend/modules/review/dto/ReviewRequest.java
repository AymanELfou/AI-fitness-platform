package org.smarttrainer.backend.modules.review.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long coachId;
    private Long clientId;
    private int score;
    private String comment;
}