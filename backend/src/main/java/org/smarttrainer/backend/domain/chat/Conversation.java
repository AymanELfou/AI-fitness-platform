package org.smarttrainer.backend.domain.chat;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.user.User;

import java.util.List;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Conversation extends BaseEntity {

    // 🔗 Participants
    @ManyToMany
    @JoinTable(
            name = "conversation_users",
            joinColumns = @JoinColumn(name = "conversation_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> participants;

    // 🔗 Messages
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;
}