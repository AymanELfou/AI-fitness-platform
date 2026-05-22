package org.smarttrainer.backend.domain.client;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.smarttrainer.backend.domain.abonnement.Abonnement;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.comment.Comment;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.post.Post;
import org.smarttrainer.backend.domain.programme.Programme;
import org.smarttrainer.backend.domain.progress.Progress;
import org.smarttrainer.backend.domain.seance.Seance;
import org.smarttrainer.backend.domain.subscription.Subscription;
import org.smarttrainer.backend.domain.user.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "client_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ClientProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id",nullable = false, updatable = true)
    private User user;

    private int age;
    private Double poids;
    private Double taille;
    private String but;
    private String niveau;
    private Double imc;
    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan", nullable = false)
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.FREEMIUM;

    @OneToMany(mappedBy = "client")
    private List<Subscription> subscriptions;

    //The relationship between client and coach
    @ManyToOne
    @JoinColumn(name = "coach_id")
    private CoachProfile coach;

    //The relationship between client and club
    @ManyToOne
    @JoinColumn(name = "club_id")
    private ClubProfile club;

    @ManyToMany
    @JoinTable(
            name="client_seance",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "seance_id")
    )
    private List<Seance> seances;

    @ManyToMany
    @JoinTable(
            name = "client_programme",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "programme_id")
    )
    private List<Programme> programmes;

    @OneToMany(mappedBy = "client")
    private List<Progress> progresses;

    //Auto calculate the IMC id data available
    @PrePersist
    @PreUpdate
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if(poids != null && taille != null && taille > 0){
            double tailleEnMetres = taille / 100.0;
            this.imc = poids / (tailleEnMetres * tailleEnMetres);
        }
    }

    public Double calculateIMC(){
        if (poids == null || taille == null || taille == 0) return null ;
        double tailleEnMetres = taille / 100.0;
        return poids / (tailleEnMetres * tailleEnMetres);
    }

}
