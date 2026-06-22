package org.smarttrainer.backend.modules.comment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String content;
    private Long postId;
    private Long userId;
    private String userName;
}