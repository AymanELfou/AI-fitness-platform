package org.smarttrainer.backend.modules.comment.mapper;

import org.smarttrainer.backend.domain.comment.Comment;
import org.smarttrainer.backend.modules.comment.dto.CommentRequest;
import org.smarttrainer.backend.modules.comment.dto.CommentResponse;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .createdAt(comment.getCreatedAt())
                .content(comment.getContent())
                .postId(comment.getPost().getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().fullName())
                .build();
    }

    public Comment toEntity(CommentRequest request) {
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        return comment;
        // post and user set in service
    }
}