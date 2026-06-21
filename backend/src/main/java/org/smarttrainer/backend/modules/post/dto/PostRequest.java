package org.smarttrainer.backend.modules.post.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String content;
    private Long communityId;
    private Long userId;
}