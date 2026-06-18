package org.smarttrainer.backend.modules.community.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommunityResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String name;
    private String description;
    private Long clubId;
    private String clubName;
}