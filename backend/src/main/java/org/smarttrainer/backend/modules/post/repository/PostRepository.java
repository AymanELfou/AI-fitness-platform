package org.smarttrainer.backend.modules.post.repository;

import org.smarttrainer.backend.domain.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCommunityId(Long communityId);
    List<Post> findByUserId(Long userId);
    List<Post> findByCommunityIdOrderByCreatedAtDesc(Long communityId);
}