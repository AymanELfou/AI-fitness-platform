package org.smarttrainer.backend.modules.chat.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.chat.Conversation;
import org.smarttrainer.backend.domain.chat.Message;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.chat.dto.ConversationRequest;
import org.smarttrainer.backend.modules.chat.dto.ConversationResponse;
import org.smarttrainer.backend.modules.chat.dto.MessageRequest;
import org.smarttrainer.backend.modules.chat.dto.MessageResponse;
import org.smarttrainer.backend.modules.chat.mapper.ChatMapper;
import org.smarttrainer.backend.modules.chat.repository.ConversationRepository;
import org.smarttrainer.backend.modules.chat.repository.MessageRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatMapper chatMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ConversationResponse createConversation(ConversationRequest request) {
        List<User> participants = userRepository.findAllById(request.getParticipantIds());
        if (participants.size() < 2) {
            throw new RuntimeException("A conversation needs at least 2 participants");
        }

        Conversation conversation = new Conversation();
        conversation.setParticipants(participants);

        return chatMapper.toConversationResponse(conversationRepository.save(conversation));
    }

    public List<ConversationResponse> getConversationsByUserId(Long userId) {
        return conversationRepository.findByParticipantId(userId)
                .stream()
                .map(chatMapper::toConversationResponse)
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(chatMapper::toMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse sendMessage(MessageRequest request) {
        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setRead(false);

        MessageResponse response = chatMapper.toMessageResponse(messageRepository.save(message));

        // Send via WebSocket to all participants
        conversation.getParticipants().forEach(participant -> {
            messagingTemplate.convertAndSendToUser(
                    participant.getEmail(),
                    "/queue/messages",
                    response
            );
        });

        return response;
    }

    @Transactional
    public void markAsRead(Long conversationId, Long userId) {
        List<Message> unread = messageRepository
                .findByConversationIdAndIsReadFalseAndSenderIdNot(conversationId, userId);
        unread.forEach(m -> m.setRead(true));
        messageRepository.saveAll(unread);
    }
}