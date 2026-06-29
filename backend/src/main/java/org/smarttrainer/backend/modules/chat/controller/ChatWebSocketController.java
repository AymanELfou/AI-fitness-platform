package org.smarttrainer.backend.modules.chat.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.chat.dto.MessageRequest;
import org.smarttrainer.backend.modules.chat.dto.MessageResponse;
import org.smarttrainer.backend.modules.chat.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequest request) {
        chatService.sendMessage(request);
    }
}