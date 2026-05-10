package org.smarttrainer.backend.domain.client;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    @Column(nullable = false)
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.FREEMIUM;

    //The relationship between client and coach
    @ManyToOne
    @JoinColumn(name = "coach_id")
    private CoachProfile coach;

    //The relationship between client and club
    @ManyToOne
    @JoinColumn(name = "club_id")
    private ClubProfile club;


    //Auto calculate the IMC id data available
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if(poids != null && taille != null && taille > 0){
            double tailleEnMetres = taille / 100.0;
            this.imc = poids / (tailleEnMetres * tailleEnMetres);
        }
    }

    public Double calculerIMC(){
        if (poids == null || taille == null || taille == 0) return null ;
        double tailleEnMetres = taille / 100.0;
        return poids / (tailleEnMetres * tailleEnMetres);
    }

}
