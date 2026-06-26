package org.smarttrainer.backend.modules.post.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String content;
    private String imageUrl;
    private Long communityId;
    private Long userId;
    private String userName;
    private int commentsCount;
    private int likesCount;
    private String userRole;
}