package org.smarttrainer.backend.domain.chat;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.user.User;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Message extends BaseEntity {

    // 🔗 Conversation
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    // 🔗 Sender
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    private String content;

    private boolean isRead;
}