// modules/chat/dto/MessageRequest.java
package org.smarttrainer.backend.modules.chat.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private Long conversationId;
    private Long senderId;
    private String content;
}