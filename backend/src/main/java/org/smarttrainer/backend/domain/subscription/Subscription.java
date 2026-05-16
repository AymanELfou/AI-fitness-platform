package org.smarttrainer.backend.domain.subscription;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.abonnement.Abonnement;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscription")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientProfile client;

    // 🔗 Abonnement (plan)
    @ManyToOne
    @JoinColumn(name = "abonnement_id", nullable = false)
    private Abonnement abonnement;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;
}
