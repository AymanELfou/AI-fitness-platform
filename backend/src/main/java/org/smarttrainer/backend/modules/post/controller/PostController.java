package org.smarttrainer.backend.modules.post.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.post.dto.PostRequest;
import org.smarttrainer.backend.modules.post.dto.PostResponse;
import org.smarttrainer.backend.modules.post.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService service;

    @PostMapping("{userId}")
    public ResponseEntity<PostResponse> create(
            @PathVariable Long userId,
            @RequestBody PostRequest request) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    @GetMapping("{id}")
    public ResponseEntity<PostResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("community/{communityId}")
    public ResponseEntity<List<PostResponse>> getByCommunityId(@PathVariable Long communityId) {
        return ResponseEntity.ok(service.getByCommunityId(communityId));
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<PostResponse>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @PutMapping("{id}")
    public ResponseEntity<PostResponse> update(
            @PathVariable Long id,
            @RequestBody PostRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}