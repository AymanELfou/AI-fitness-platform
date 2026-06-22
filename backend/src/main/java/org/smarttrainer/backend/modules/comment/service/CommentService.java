package org.smarttrainer.backend.modules.comment.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.comment.Comment;
import org.smarttrainer.backend.domain.post.Post;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.comment.dto.CommentRequest;
import org.smarttrainer.backend.modules.comment.dto.CommentResponse;
import org.smarttrainer.backend.modules.comment.mapper.CommentMapper;
import org.smarttrainer.backend.modules.comment.repository.CommentRepository;
import org.smarttrainer.backend.modules.post.repository.PostRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Transactional
    public CommentResponse create(Long userId, CommentRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentMapper.toEntity(request);
        comment.setPost(post);
        comment.setUser(user);

        return commentMapper.toResponse(commentRepository.save(comment));
    }

    public List<CommentResponse> getByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CommentResponse> getByUserId(Long userId) {
        return commentRepository.findByUserId(userId)
                .stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse update(Long id, CommentRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(request.getContent());

        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Transactional
    public void delete(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found");
        }
        commentRepository.deleteById(id);
    }
}