package org.smarttrainer.backend.modules.community.dto;

import lombok.Data;

@Data
public class CommunityRequest {
    private String name;
    private String description;
    private Long clubId;
}