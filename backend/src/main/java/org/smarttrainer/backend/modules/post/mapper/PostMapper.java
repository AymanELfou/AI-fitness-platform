package org.smarttrainer.backend.modules.post.mapper;

import org.smarttrainer.backend.domain.post.Post;
import org.smarttrainer.backend.modules.post.dto.PostRequest;
import org.smarttrainer.backend.modules.post.dto.PostResponse;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostResponse toResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .createdAt(post.getCreatedAt())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .communityId(post.getCommunity() != null ? post.getCommunity().getId() : null)
                .userId(post.getUser() != null ? post.getUser().getId() : null)
                .userName(post.getUser() != null ? post.getUser().fullName() : null)
                .commentsCount(post.getComments() != null ? post.getComments().size() : 0)
                .likesCount(post.getLikes() != null ? post.getLikes().size() : 0)
                .build();
    }

    public Post toEntity(PostRequest request) {
        Post post = new Post();
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        return post;
    }
}