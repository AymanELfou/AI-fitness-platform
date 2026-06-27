package org.smarttrainer.backend.modules.like.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.like.dto.LikeResponse;
import org.smarttrainer.backend.modules.like.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LikeController {

    private final LikeService service;

    @PostMapping("toggle/{postId}/{userId}")
    public ResponseEntity<String> toggle(
            @PathVariable Long postId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(service.toggle(postId, userId));
    }

    @GetMapping("post/{postId}")
    public ResponseEntity<List<LikeResponse>> getByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(service.getByPostId(postId));
    }

    @GetMapping("post/{postId}/count")
    public ResponseEntity<Integer> countByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(service.countByPostId(postId));
    }
}