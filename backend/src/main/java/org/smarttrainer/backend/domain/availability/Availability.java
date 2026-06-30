package org.smarttrainer.backend.domain.availability;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.coach.CoachProfile;

import java.time.LocalDateTime;

@Entity
@Table(name = "availabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Availability extends BaseEntity {

    // Coach
    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private CoachProfile coach;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean isAvailable; // true = free, false = booked
}