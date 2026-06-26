package org.smarttrainer.backend.modules.like.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.like.Like;
import org.smarttrainer.backend.domain.post.Post;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.like.dto.LikeResponse;
import org.smarttrainer.backend.modules.like.mapper.LikeMapper;
import org.smarttrainer.backend.modules.like.repository.LikeRepository;
import org.smarttrainer.backend.modules.post.repository.PostRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeMapper likeMapper;

    @Transactional
    public String toggle(Long postId, Long userId) {
        Optional<Like> existing = likeRepository.findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return "unliked";
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Like like = new Like();
        like.setPost(post);
        like.setUser(user);
        likeRepository.save(like);

        return "liked";
    }

    public List<LikeResponse> getByPostId(Long postId) {
        return likeRepository.findByPostId(postId)
                .stream()
                .map(likeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public int countByPostId(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}