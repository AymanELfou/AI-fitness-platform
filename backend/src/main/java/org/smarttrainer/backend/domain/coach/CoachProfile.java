package org.smarttrainer.backend.domain.coach;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.user.User;

import java.util.List;

@Entity
@Table(name = "coach_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoachProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id",nullable = false, updatable = true)
    private User user;

    private int experience;
    private String certifications;
    private double rating;
    private boolean disponibilite;
    private String specialite;
    private double tarif;

    @OneToMany(mappedBy = "coach",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CoachProfile> clients;
}
