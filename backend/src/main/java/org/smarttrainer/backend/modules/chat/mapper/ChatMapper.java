package org.smarttrainer.backend.modules.chat.mapper;

import org.smarttrainer.backend.domain.chat.Conversation;
import org.smarttrainer.backend.domain.chat.Message;
import org.smarttrainer.backend.modules.chat.dto.ConversationResponse;
import org.smarttrainer.backend.modules.chat.dto.MessageResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ChatMapper {

    public MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().fullName())
                .content(message.getContent())
                .isRead(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public ConversationResponse toConversationResponse(Conversation conversation) {
        List<Long> participantIds = conversation.getParticipants().stream()
                .map(u -> u.getId())
                .collect(Collectors.toList());

        List<String> participantNames = conversation.getParticipants().stream()
                .map(u -> u.fullName())
                .collect(Collectors.toList());

        MessageResponse lastMessage = null;
        if (conversation.getMessages() != null && !conversation.getMessages().isEmpty()) {
            Message last = conversation.getMessages()
                    .get(conversation.getMessages().size() - 1);
            lastMessage = toMessageResponse(last);
        }

        return ConversationResponse.builder()
                .id(conversation.getId())
                .createdAt(conversation.getCreatedAt())
                .participantIds(participantIds)
                .participantNames(participantNames)
                .lastMessage(lastMessage)
                .build();
    }
}