package org.smarttrainer.backend.domain.abonnement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.subscription.Subscription;

import java.util.List;

@Entity
@Table(name = "abonnement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Abonnement extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private SubscriptionType type;

    private Double price;
    private int duration;
    private String description;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private ClubProfile club;

    @OneToMany(mappedBy = "abonnement")
    private List<Subscription> subscriptions;
}
