package org.smarttrainer.backend.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminProfileResponse {
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private String permissions;
}