package org.smarttrainer.backend.modules.chat.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.chat.dto.ConversationRequest;
import org.smarttrainer.backend.modules.chat.dto.ConversationResponse;
import org.smarttrainer.backend.modules.chat.dto.MessageRequest;
import org.smarttrainer.backend.modules.chat.dto.MessageResponse;
import org.smarttrainer.backend.modules.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService service;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> createConversation(
            @RequestBody ConversationRequest request) {
        return ResponseEntity.ok(service.createConversation(request));
    }

    @GetMapping("/conversations/user/{userId}")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            @PathVariable Long userId) {
        return ResponseEntity.ok(service.getConversationsByUserId(userId));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long conversationId) {
        return ResponseEntity.ok(service.getMessages(conversationId));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageRequest request) {
        return ResponseEntity.ok(service.sendMessage(request));
    }

    @PatchMapping("/conversations/{conversationId}/read/{userId}")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long conversationId,
            @PathVariable Long userId) {
        service.markAsRead(conversationId, userId);
        return ResponseEntity.noContent().build();
    }
}