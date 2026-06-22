package org.smarttrainer.backend.modules.comment.repository;

import org.smarttrainer.backend.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserId(Long userId);
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
}