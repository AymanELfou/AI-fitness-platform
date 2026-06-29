// modules/chat/dto/ConversationResponse.java
package org.smarttrainer.backend.modules.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ConversationResponse {
    private Long id;
    private LocalDateTime createdAt;
    private List<Long> participantIds;
    private List<String> participantNames;
    private MessageResponse lastMessage;
}