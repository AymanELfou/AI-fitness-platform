package org.smarttrainer.backend.modules.comment.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.comment.dto.CommentRequest;
import org.smarttrainer.backend.modules.comment.dto.CommentResponse;
import org.smarttrainer.backend.modules.comment.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/comments")
@RequiredArgsConstructor

public class CommentController {

    private final CommentService service;

    @PostMapping("{userId}")
    public ResponseEntity<CommentResponse> create(
            @PathVariable Long userId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    @GetMapping("post/{postId}")
    public ResponseEntity<List<CommentResponse>> getByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(service.getByPostId(postId));
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<CommentResponse>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @PutMapping("{id}")
    public ResponseEntity<CommentResponse> update(
            @PathVariable Long id,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}