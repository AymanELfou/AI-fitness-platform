package org.smarttrainer.backend.domain.review;

import jakarta.persistence.*;
import lombok.*;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;

@Entity
@Table(name = "reviews",
        uniqueConstraints = @UniqueConstraint(columnNames = {"coach_id", "client_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who is being rated
    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private CoachProfile coach;

    // Who gives the rating
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientProfile client;

    // Rating score (1 → 5)
    private int score;

    // Optional comment
    private String comment;
}