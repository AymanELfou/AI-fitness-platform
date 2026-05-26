package org.smarttrainer.backend.modules.club.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClubProfileResponse {
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private String clubName;
    private String localisation;
    private int capacity;
    private String contactEmail;
    private String phone;
}