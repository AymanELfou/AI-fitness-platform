package org.smarttrainer.backend.modules.like.mapper;

import org.smarttrainer.backend.domain.like.Like;
import org.smarttrainer.backend.modules.like.dto.LikeResponse;
import org.springframework.stereotype.Component;

@Component
public class LikeMapper {

    public LikeResponse toResponse(Like like) {
        return LikeResponse.builder()
                .id(like.getId())
                .postId(like.getPost().getId())
                .userId(like.getUser().getId())
                .userName(like.getUser().fullName())
                .createdAt(like.getCreatedAt())
                .build();
    }
}