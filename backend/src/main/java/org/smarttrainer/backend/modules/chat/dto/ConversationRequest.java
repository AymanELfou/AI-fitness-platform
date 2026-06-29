// modules/chat/dto/ConversationRequest.java
package org.smarttrainer.backend.modules.chat.dto;

import lombok.Data;

import java.util.List;

@Data
public class ConversationRequest {
    private List<Long> participantIds;
}