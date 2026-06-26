package org.smarttrainer.backend.modules.like.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LikeResponse {
    private Long id;
    private Long postId;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
}