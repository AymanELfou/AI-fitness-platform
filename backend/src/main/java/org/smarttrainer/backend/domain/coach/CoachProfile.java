package org.smarttrainer.backend.domain.coach;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.availability.Availability;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.programme.Programme;
import org.smarttrainer.backend.domain.review.Review;
import org.smarttrainer.backend.domain.seance.Seance;
import org.smarttrainer.backend.domain.user.User;

import java.math.BigDecimal;
import java.util.ArrayList;
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
    private String speciality;
    private BigDecimal tariff;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Availability> availabilities;

    @OneToMany(mappedBy = "coach",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClientProfile> clients;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "club_id",nullable = false)
    private ClubProfile club;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seance> seances = new ArrayList<>();

    @OneToMany(mappedBy = "coach",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Programme> programmes;
}
