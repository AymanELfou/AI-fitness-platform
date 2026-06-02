package org.smarttrainer.backend.domain.club;
import org.smarttrainer.backend.domain.client.SubscriptionPlan;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.abonnement.Abonnement;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.community.Community;
import org.smarttrainer.backend.domain.user.User;

import java.util.List;

@Entity
@Table(name = "club_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClubProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id",nullable = false, updatable = true)
    private User user;

    private String clubName;
    private String localisation;
    private int capacity;
    private String contactEmail;
    private String phone;
    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan", nullable = false)
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.PREMIUM;

    @OneToMany(mappedBy = "club",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CoachProfile> coaches;

    @OneToMany(mappedBy = "club",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClientProfile> clients;

    @OneToOne(mappedBy = "club",cascade = CascadeType.ALL,orphanRemoval = true)
    private Community community;

    @OneToMany(mappedBy = "club")
    private List<Abonnement> abonnements;
}
