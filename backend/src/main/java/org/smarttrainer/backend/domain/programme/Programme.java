package org.smarttrainer.backend.domain.programme;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;

@Entity
@Table(name = "programme")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Programme extends BaseEntity {

    private String title;
    private String description;
    private int duration;
    private String niveau;
    private String objectif;
    private String isGeneretedByAI;

    @ManyToOne
    @JoinColumn(name = "coach_id",nullable = false)
    private CoachProfile coach;

}
