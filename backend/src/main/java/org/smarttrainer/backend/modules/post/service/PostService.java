package org.smarttrainer.backend.modules.post.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.community.Community;
import org.smarttrainer.backend.domain.post.Post;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.community.repository.CommunityRepository;
import org.smarttrainer.backend.modules.post.dto.PostRequest;
import org.smarttrainer.backend.modules.post.dto.PostResponse;
import org.smarttrainer.backend.modules.post.mapper.PostMapper;
import org.smarttrainer.backend.modules.post.repository.PostRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    @Transactional
    public PostResponse create(Long userId, PostRequest request) {
        Community community = communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new RuntimeException("Community not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postMapper.toEntity(request);
        post.setCommunity(community);
        post.setUser(user);

        return postMapper.toResponse(postRepository.save(post));
    }

    public PostResponse getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return postMapper.toResponse(post);
    }

    public List<PostResponse> getByCommunityId(Long communityId) {
        return postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId)
                .stream()
                .map(postMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getByUserId(Long userId) {
        return postRepository.findByUserId(userId)
                .stream()
                .map(postMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse update(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setContent(request.getContent());

        return postMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found");
        }
        postRepository.deleteById(id);
    }
}